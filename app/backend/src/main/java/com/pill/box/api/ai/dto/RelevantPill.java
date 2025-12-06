package com.pill.box.api.ai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RelevantPill {
    
    private Long id;
    
    private String name;
    
    private String description;
    
    @JsonProperty("medkit_id")
    private Long medkitId;
    
    @JsonProperty("medkit_name")
    private String medkitName;
    
    @JsonProperty("similarity_score")
    private Float similarityScore;
}
