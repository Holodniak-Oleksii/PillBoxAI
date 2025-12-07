package com.pill.box.api.ai;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pill.box.api.ai.dto.PillRecommendationRequest;
import com.pill.box.api.ai.dto.PillRecommendationResponse;
import com.pill.box.api.ai.dto.RelevantPill;
import com.pill.box.api.exception.AiProcessingException;
import com.pill.box.api.medkit.Medkit;
import com.pill.box.api.medkit.MedkitRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PillRecommendationService {
    
    private static final int DEFAULT_TOP_K = 5;
    private static final String RECOMMENDATION_PROMPT_TEMPLATE = """
            You are a helpful assistant providing informational advice about medications.
            Based on the user's query and the available medications from their medkit, suggest which medication might be appropriate.
            
            User Query: %s
            
            Available Medications:
            %s
            
            LANGUAGE REQUIREMENT:
            - Provide your response in %s language
            
            Please provide:
            1. Brief analysis of the query
            2. Which medication(s) from the list might be relevant and why
            3. Important safety reminders
            
            Response format: Clear, conversational text with proper paragraphs.
            """;
    
    private final PillVectorStoreService vectorStoreService;
    private final MedkitRepository medkitRepository;
    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;
    
    public PillRecommendationResponse getRecommendations(PillRecommendationRequest request, Long userId) {
        log.info("Getting pill recommendations for user: {}, medkitId: {}", userId, request.getMedkitId());
        
        List<Long> medkitIds = determineMedkitIds(request.getMedkitId(), userId);
        validateUserAccess(userId, medkitIds);
        
        List<PillEmbedding> similarPills = vectorStoreService.findSimilarPills(
                request.getQuery(),
                medkitIds,
                DEFAULT_TOP_K
        );
        
        if (similarPills.isEmpty()) {
            return buildEmptyResponse(request.getLanguage());
        }
        
        String context = buildContext(similarPills);
        String aiRecommendation = getAiRecommendation(
                request.getQuery(),
                context,
                request.getLanguage()
        );
        
        List<RelevantPill> relevantPills = mapToRelevantPills(similarPills);
        
        return buildResponse(aiRecommendation, relevantPills, medkitIds, request.getLanguage());
    }
    
    private List<Long> determineMedkitIds(Long requestedMedkitId, Long userId) {
        if (requestedMedkitId != null) {
            return List.of(requestedMedkitId);
        }
        
        return getAllUserMedkitIds(userId);
    }
    
    private List<Long> getAllUserMedkitIds(Long userId) {
        return medkitRepository.findAllAccessibleByUserId(userId)
                .stream()
                .map(Medkit::getId)
                .toList();
    }
    
    private void validateUserAccess(Long userId, List<Long> medkitIds) {
        List<Long> accessibleMedkits = getAllUserMedkitIds(userId);
        
        boolean hasAccess = medkitIds.stream()
                .allMatch(accessibleMedkits::contains);
        
        if (!hasAccess) {
            throw new AccessDeniedException("User doesn't have access to requested medkit(s)");
        }
    }
    
    private String buildContext(List<PillEmbedding> pills) {
        StringBuilder context = new StringBuilder();
        
        for (int i = 0; i < pills.size(); i++) {
            PillEmbedding embedding = pills.get(i);
            context.append(i + 1).append(". ");
            context.append(embedding.getContent());
            
            try {
                Map<String, Object> metadata = objectMapper.readValue(
                        embedding.getMetadata(),
                        new TypeReference<Map<String, Object>>() {}
                );
                context.append("\n   Medkit: ").append(metadata.get("medkit_name"));
            } catch (Exception e) {
                log.warn("Failed to parse metadata for embedding {}", embedding.getId());
            }
            
            context.append("\n\n");
        }
        
        return context.toString();
    }
    
    private String getAiRecommendation(String query, String context, String language) {
        try {
            String languageFullName = getLanguageFullName(language);
            String prompt = String.format(RECOMMENDATION_PROMPT_TEMPLATE, query, context, languageFullName);
            
            return chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();
        } catch (Exception e) {
            log.error("Failed to get AI recommendation", e);
            throw new AiProcessingException("Failed to generate recommendation: " + e.getMessage(), e);
        }
    }
    
    private List<RelevantPill> mapToRelevantPills(List<PillEmbedding> embeddings) {
        List<RelevantPill> relevantPills = new ArrayList<>();
        
        for (PillEmbedding embedding : embeddings) {
            try {
                Map<String, Object> metadata = objectMapper.readValue(
                        embedding.getMetadata(),
                        new TypeReference<Map<String, Object>>() {}
                );
                
                RelevantPill relevantPill = RelevantPill.builder()
                        .id(embedding.getPill().getId())
                        .name(embedding.getPill().getName())
                        .description(embedding.getPill().getDescription())
                        .medkitId(embedding.getMedkit().getId())
                        .medkitName((String) metadata.get("medkit_name"))
                        .build();
                
                relevantPills.add(relevantPill);
            } catch (Exception e) {
                log.warn("Failed to map embedding {} to RelevantPill", embedding.getId(), e);
            }
        }
        
        return relevantPills;
    }
    
    private PillRecommendationResponse buildResponse(
            String recommendation,
            List<RelevantPill> relevantPills,
            List<Long> searchedMedkitIds,
            String language) {
        
        return PillRecommendationResponse.builder()
                .recommendation(recommendation)
                .relevantPills(relevantPills)
                .searchedMedkitIds(searchedMedkitIds)
                .disclaimer(getDisclaimer(language))
                .build();
    }
    
    private PillRecommendationResponse buildEmptyResponse(String language) {
        String emptyMessage = language != null && language.toLowerCase().startsWith("uk")
                ? "На жаль, не знайдено відповідних ліків у ваших аптечках. Будь ласка, спробуйте переформулювати запит або додайте більше ліків до вашої аптечки."
                : "Unfortunately, no relevant medications were found in your medkits. Please try rephrasing your query or add more medications to your medkit.";
        
        return PillRecommendationResponse.builder()
                .recommendation(emptyMessage)
                .relevantPills(List.of())
                .searchedMedkitIds(List.of())
                .disclaimer(getDisclaimer(language))
                .build();
    }
    
    private String getDisclaimer(String language) {
        if (language != null && language.toLowerCase().startsWith("uk")) {
            return """
                    ⚠️ ВАЖЛИВО: Це лише інформаційна порада, а не медична консультація.
                    Завжди консультуйтеся з лікарем або фармацевтом перед прийомом будь-яких ліків.;
                    """;
        }
        return """
                ⚠️ IMPORTANT: This is informational advice only, not medical consultation.
                Always consult with a doctor or pharmacist before taking any medication.""";
    }
    
    private String getLanguageFullName(String languageCode) {
        if (languageCode == null) {
            return "English";
        }
        return switch (languageCode.toLowerCase()) {
            case "uk", "ua" -> "Ukrainian";
            default -> "English";
        };
    }
}
