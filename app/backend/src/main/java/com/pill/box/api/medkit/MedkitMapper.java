package com.pill.box.api.medkit;

import com.pill.box.api.medkit.dto.MedkitRequest;
import com.pill.box.api.medkit.dto.MedkitResponse;
import com.pill.box.api.user.User;
import org.springframework.stereotype.Component;

@Component
public class MedkitMapper {

    public Medkit toEntity(MedkitRequest request, User owner) {
        Medkit medkit = new Medkit();
        medkit.setOwner(owner);
        medkit.setName(request.getName());
        medkit.setDescription(request.getDescription());
        medkit.setIcon(request.getIcon());
        return medkit;
    }

    public MedkitResponse toResponse(Medkit medkit) {
        return MedkitResponse.builder()
                .id(medkit.getId())
                .ownerId(medkit.getOwner().getId())
                .ownerUsername(medkit.getOwner().getUsername())
                .name(medkit.getName())
                .description(medkit.getDescription())
                .icon(medkit.getIcon())
                .createdAt(medkit.getCreatedAt())
                .updatedAt(medkit.getUpdatedAt())
                .build();
    }

    public void updateEntity(Medkit medkit, MedkitRequest request) {
        medkit.setName(request.getName());
        medkit.setDescription(request.getDescription());
        medkit.setIcon(request.getIcon());
    }
}
