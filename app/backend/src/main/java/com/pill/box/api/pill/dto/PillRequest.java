package com.pill.box.api.pill.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PillRequest {
    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    private String name;
    
    @Size(max = 255, message = "Active substance must not exceed 255 characters")
    private String activeSubstance;
    
    private String description;
    
    private String usageInstructions;
    
    private String sideEffects;
    
    private String contraindications;
    
    @NotNull(message = "Expiry date is required")
    private LocalDate expiryDate;

    @NotNull(message = "Quantity is required")
    private Integer quantity;
}
