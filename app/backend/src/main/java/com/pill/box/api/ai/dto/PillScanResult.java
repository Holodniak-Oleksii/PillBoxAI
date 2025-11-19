package com.pill.box.api.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PillScanResult {
    private String name;
    private String activeSubstance;
    private String description;
    private String usageInstructions;
    private String sideEffects;
    private String contraindications;
    private LocalDate expiryDate;
    private Integer quantity;
    private Double confidence;
    private boolean success;
    private String errorMessage;
}
