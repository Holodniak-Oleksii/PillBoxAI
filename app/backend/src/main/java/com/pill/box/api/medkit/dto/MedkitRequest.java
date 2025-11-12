package com.pill.box.api.medkit.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class MedkitRequest {
    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;
    
    private String description;
    
    @Size(max = 50, message = "Icon must not exceed 50 characters")
    private String icon;
}
