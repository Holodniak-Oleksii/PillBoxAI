package com.pill.box.api.medkit.member;

import com.pill.box.api.medkit.Medkit;
import com.pill.box.api.medkit.member.dto.MedkitMemberRequest;
import com.pill.box.api.medkit.member.dto.MedkitMemberResponse;
import com.pill.box.api.user.User;
import org.springframework.stereotype.Component;

@Component
public class MedkitMemberMapper {

    public MedkitMember toEntity(MedkitMemberRequest request, Medkit medkit, User user) {
        MedkitMember member = new MedkitMember();
        member.setMedkit(medkit);
        member.setUser(user);
        member.setRole(request.getRole());
        return member;
    }

    public MedkitMemberResponse toResponse(MedkitMember member) {
        return MedkitMemberResponse.builder()
                .id(member.getId())
                .medkitId(member.getMedkit().getId())
                .medkitName(member.getMedkit().getName())
                .userId(member.getUser().getId())
                .username(member.getUser().getUsername())
                .role(member.getRole())
                .createdAt(member.getCreatedAt())
                .updatedAt(member.getUpdatedAt())
                .build();
    }
}
