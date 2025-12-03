package com.pill.box.api.ai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PillRecommendationRequest {
    
    @NotBlank(message = "Query is required")
    private String query;
    
    @JsonProperty("medkit_id")
    private Long medkitId;
    
    @Builder.Default
    private String language = "en";
}
