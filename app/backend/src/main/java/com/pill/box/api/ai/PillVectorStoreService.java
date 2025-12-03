package com.pill.box.api.ai;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pill.box.api.exception.AiProcessingException;
import com.pill.box.api.pill.Pill;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PillVectorStoreService {
    
    private final PillEmbeddingRepository embeddingRepository;
    private final EmbeddingModel embeddingModel;
    private final ObjectMapper objectMapper;
    
    @Transactional
    public PillEmbedding createOrUpdateEmbedding(Pill pill) {
        log.info("Creating/updating embedding for pill: {}", pill.getId());
        
        String content = buildPillContent(pill);
        float[] embedding = generateEmbedding(content);
        String metadata = buildMetadata(pill);
        
        Optional<PillEmbedding> existingOpt = embeddingRepository.findByPillId(pill.getId());
        
        PillEmbedding pillEmbedding;
        if (existingOpt.isPresent()) {
            pillEmbedding = existingOpt.get();
            pillEmbedding.setContent(content);
            pillEmbedding.setEmbedding(embedding);
            pillEmbedding.setMetadata(metadata);
        } else {
            pillEmbedding = PillEmbedding.builder()
                    .pill(pill)
                    .medkit(pill.getMedkit())
                    .user(pill.getCreatedBy())
                    .content(content)
                    .embedding(embedding)
                    .metadata(metadata)
                    .build();
        }
        
        return embeddingRepository.save(pillEmbedding);
    }
    
    @Transactional
    public void createEmbeddingsForPills(List<Pill> pills) {
        log.info("Creating embeddings for {} pills", pills.size());
        pills.forEach(this::createOrUpdateEmbedding);
    }
    
    @Transactional
    public void deleteEmbedding(Long pillId) {
        log.info("Deleting embedding for pill: {}", pillId);
        embeddingRepository.deleteByPillId(pillId);
    }
    
    public List<PillEmbedding> findSimilarPills(String query, Long medkitId, int topK) {
        float[] queryEmbedding = generateEmbedding(query);
        String embeddingString = vectorToString(queryEmbedding);
        
        return embeddingRepository.findSimilarByMedkit(medkitId, embeddingString, topK);
    }
    
    public List<PillEmbedding> findSimilarPills(String query, List<Long> medkitIds, int topK) {
        if (medkitIds == null || medkitIds.isEmpty()) {
            throw new IllegalArgumentException("Medkit IDs list cannot be empty");
        }
        
        float[] queryEmbedding = generateEmbedding(query);
        String embeddingString = vectorToString(queryEmbedding);
        
        if (medkitIds.size() == 1) {
            return embeddingRepository.findSimilarByMedkit(medkitIds.get(0), embeddingString, topK);
        }
        
        return embeddingRepository.findSimilarByMedkits(medkitIds, embeddingString, topK);
    }
    
    public float[] generateEmbedding(String text) {
        try {
            log.debug("Generating embedding for text: {}", text.substring(0, Math.min(50, text.length())));
            
            return embeddingModel.embed(text);
        } catch (Exception e) {
            log.error("Failed to generate embedding", e);
            throw new AiProcessingException("Failed to generate embedding: " + e.getMessage(), e);
        }
    }
    
    private String buildPillContent(Pill pill) {
        StringBuilder content = new StringBuilder();
        content.append("Name: ").append(pill.getName()).append("\n");
        
        if (pill.getDescription() != null && !pill.getDescription().isEmpty()) {
            content.append("Description: ").append(pill.getDescription()).append("\n");
        }
        
        if (pill.getExpiryDate() != null) {
            content.append("Expiry Date: ").append(pill.getExpiryDate()).append("\n");
        }
        
        if (pill.getQuantity() != null) {
            content.append("Quantity: ").append(pill.getQuantity()).append("\n");
        }
        
        return content.toString().trim();
    }
    
    private String buildMetadata(Pill pill) {
        try {
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("pill_id", pill.getId());
            metadata.put("pill_name", pill.getName());
            metadata.put("medkit_id", pill.getMedkit().getId());
            metadata.put("medkit_name", pill.getMedkit().getName());
            
            if (pill.getExpiryDate() != null) {
                metadata.put("expiry_date", pill.getExpiryDate().toString());
            }
            
            if (pill.getQuantity() != null) {
                metadata.put("quantity", pill.getQuantity());
            }
            
            return objectMapper.writeValueAsString(metadata);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize metadata", e);
            return "{}";
        }
    }
    
    private String vectorToString(float[] vector) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < vector.length; i++) {
            if (i > 0) sb.append(",");
            sb.append(vector[i]);
        }
        sb.append("]");
        return sb.toString();
    }
}
