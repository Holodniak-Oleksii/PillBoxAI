package com.pill.box.api.medkit.member.dto;

import com.pill.box.api.medkit.MedkitRole;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MedkitMemberRequest {
    @NotNull(message = "User ID is required")
    private Long userId;
    
    @NotNull(message = "Role is required")
    private MedkitRole role;
}
