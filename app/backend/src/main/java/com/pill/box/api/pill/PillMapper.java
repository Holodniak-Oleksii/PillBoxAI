package com.pill.box.api.pill;

import com.pill.box.api.medkit.Medkit;
import com.pill.box.api.pill.dto.PillRequest;
import com.pill.box.api.pill.dto.PillResponse;
import com.pill.box.api.user.User;
import org.springframework.stereotype.Component;

@Component
public class PillMapper {

    public Pill toEntity(PillRequest request, Medkit medkit, User createdBy) {
        Pill pill = new Pill();
        pill.setMedkit(medkit);
        pill.setCreatedBy(createdBy);
        pill.setName(request.getName());
        pill.setDescription(request.getDescription());
        pill.setExpiryDate(request.getExpiryDate());
        pill.setQuantity(request.getQuantity());
        return pill;
    }

    public PillResponse toResponse(Pill pill) {
        return PillResponse.builder()
                .id(pill.getId())
                .medkitId(pill.getMedkit().getId())
                .medkitName(pill.getMedkit().getName())
                .name(pill.getName())
                .description(pill.getDescription())
                .expiryDate(pill.getExpiryDate())
                .quantity(pill.getQuantity())
                .createdById(pill.getCreatedBy() != null ? pill.getCreatedBy().getId() : null)
                .createdByUsername(pill.getCreatedBy() != null ? pill.getCreatedBy().getUsername() : null)
                .createdAt(pill.getCreatedAt())
                .updatedAt(pill.getUpdatedAt())
                .build();
    }

    public void updateEntity(Pill pill, PillRequest request) {
        pill.setName(request.getName());
        pill.setDescription(request.getDescription());
        pill.setExpiryDate(request.getExpiryDate());
        pill.setQuantity(request.getQuantity());
    }
}
