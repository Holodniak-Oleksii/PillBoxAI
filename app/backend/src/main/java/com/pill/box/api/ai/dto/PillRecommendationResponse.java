package com.pill.box.api.ai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PillRecommendationResponse {
    
    private String recommendation;
    
    @JsonProperty("relevant_pills")
    private List<RelevantPill> relevantPills;
    
    @JsonProperty("searched_medkit_ids")
    private List<Long> searchedMedkitIds;

    private String disclaimer;
}
