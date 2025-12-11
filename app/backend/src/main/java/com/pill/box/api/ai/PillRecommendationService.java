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
import java.util.Set;
import java.util.stream.Collectors;

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
            1. Which medication(s) from the list might be relevant and why
            2. Important safety reminders
            
            CRITICAL INSTRUCTIONS:
            - You MUST respond with valid JSON in this exact format:
            {
              "recommendation": "your detailed text recommendation here",
              "recommended_pill_ids": [7, 10]
            }
            
            - In "recommendation" field: write clear, conversational text WITHOUT mentioning any IDs or numbers. 
              Just refer to medications by their names naturally.
            
            - In "recommended_pill_ids" array: include ONLY the actual Pill IDs (shown as [Pill ID: X] in the list above) 
              of medications that you actually recommend. For example, if you recommend medication with [Pill ID: 7] 
              and [Pill ID: 10], use [7, 10]. If you don't recommend any specific medication, use an empty array [].
            
            - NEVER include "[Pill ID: X]" or any ID references in the recommendation text!
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
        AiRecommendationResult aiResult = getAiRecommendation(
                request.getQuery(),
                context,
                request.getLanguage()
        );
        
        List<RelevantPill> relevantPills = mapToRelevantPills(similarPills, aiResult.recommendedPillIds());
        
        return buildResponse(aiResult.recommendation(), relevantPills, medkitIds, request.getLanguage());
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
            
            context.append("\n   [Pill ID: ").append(embedding.getPill().getId()).append("]");
            context.append("\n\n");
        }
        
        return context.toString();
    }
    
    private AiRecommendationResult getAiRecommendation(String query, String context, String language) {
        try {
            String languageFullName = getLanguageFullName(language);
            String prompt = String.format(RECOMMENDATION_PROMPT_TEMPLATE, query, context, languageFullName);
            
            String jsonResponse = chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();
            
            log.debug("AI raw response: {}", jsonResponse);
            
            String cleanedJson = extractJsonFromMarkdown(jsonResponse);
            
            Map<String, Object> parsedResponse = objectMapper.readValue(
                    cleanedJson,
                    new TypeReference<Map<String, Object>>() {}
            );
            
            String recommendation = (String) parsedResponse.get("recommendation");
            if (recommendation == null || recommendation.isBlank()) {
                throw new AiProcessingException("AI response missing recommendation text");
            }
            
            List<Integer> recommendedPillIds = (List<Integer>) parsedResponse.getOrDefault("recommended_pill_ids", List.of());
            
            Set<Long> recommendedIds = recommendedPillIds.stream()
                    .map(Number::longValue)
                    .collect(Collectors.toSet());
            
            log.info("AI recommended {} pill(s) with IDs: {}", recommendedIds.size(), recommendedIds);
            
            return new AiRecommendationResult(recommendation, recommendedIds);
        } catch (Exception e) {
            log.error("Failed to get AI recommendation", e);
            throw new AiProcessingException("Failed to generate recommendation: " + e.getMessage(), e);
        }
    }
    
    private String extractJsonFromMarkdown(String response) {
        String trimmed = response.trim();
        
        if (trimmed.startsWith("```")) {
            int firstNewline = trimmed.indexOf('\n');
            if (firstNewline == -1) {
                return trimmed;
            }
            
            int lastTripleBacktick = trimmed.lastIndexOf("```");
            if (lastTripleBacktick > firstNewline) {
                return trimmed.substring(firstNewline + 1, lastTripleBacktick).trim();
            }
        }
        
        return trimmed;
    }
    
    private List<RelevantPill> mapToRelevantPills(List<PillEmbedding> embeddings, Set<Long> recommendedPillIds) {
        List<RelevantPill> relevantPills = new ArrayList<>();
        
        log.debug("Filtering {} embeddings based on {} recommended pill IDs", embeddings.size(), recommendedPillIds.size());
        
        for (PillEmbedding embedding : embeddings) {
            Long pillId = embedding.getPill().getId();
            
            if (!recommendedPillIds.contains(pillId)) {
                log.debug("Filtering out pill ID {} ({}), not in AI recommendations", pillId, embedding.getPill().getName());
                continue;
            }
            
            try {
                Map<String, Object> metadata = objectMapper.readValue(
                        embedding.getMetadata(),
                        new TypeReference<Map<String, Object>>() {}
                );
                
                RelevantPill relevantPill = RelevantPill.builder()
                        .id(pillId)
                        .name(embedding.getPill().getName())
                        .description(embedding.getPill().getDescription())
                        .medkitId(embedding.getMedkit().getId())
                        .medkitName((String) metadata.get("medkit_name"))
                        .build();
                
                relevantPills.add(relevantPill);
                log.debug("Added recommended pill ID {} ({})", pillId, embedding.getPill().getName());
            } catch (Exception e) {
                log.warn("Failed to map embedding {} to RelevantPill", embedding.getId(), e);
            }
        }
        
        log.info("Filtered to {} relevant pills from {} candidates", relevantPills.size(), embeddings.size());
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
                    Завжди консультуйтеся з лікарем або фармацевтом перед прийомом будь-яких ліків.""";
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
    
    private record AiRecommendationResult(String recommendation, Set<Long> recommendedPillIds) {}
}
