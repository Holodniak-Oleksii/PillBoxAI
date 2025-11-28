package com.pill.box.api.pill.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PillResponse {
    private Long id;
    private Long medkitId;
    private String medkitName;
    private String name;
    private String description;
    private LocalDate expiryDate;
    private Integer quantity;
    private Long createdById;
    private String createdByUsername;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
