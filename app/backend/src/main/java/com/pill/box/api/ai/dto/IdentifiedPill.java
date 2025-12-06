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
public class IdentifiedPill {
    private String name;
    private String description;
    private LocalDate expiryDate;
    private Integer quantity;
}
