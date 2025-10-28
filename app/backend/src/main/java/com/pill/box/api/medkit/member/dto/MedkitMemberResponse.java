package com.pill.box.api.medkit.member.dto;

import com.pill.box.api.medkit.MedkitRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedkitMemberResponse {
    private Long id;
    private Long medkitId;
    private String medkitName;
    private Long userId;
    private String username;
    private MedkitRole role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
