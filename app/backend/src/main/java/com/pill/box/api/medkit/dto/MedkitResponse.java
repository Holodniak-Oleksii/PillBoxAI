package com.pill.box.api.medkit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedkitResponse {
    private Long id;
    private Long ownerId;
    private String ownerUsername;
    private String name;
    private String description;
    private String icon;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
