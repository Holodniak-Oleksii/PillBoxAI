package com.pill.box.api.medkit.member;

import com.pill.box.api.medkit.MedkitRole;
import com.pill.box.api.medkit.member.dto.MedkitMemberRequest;
import com.pill.box.api.medkit.member.dto.MedkitMemberResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/medkit-members")
public class MedkitMemberController {

    private final MedkitMemberService medkitMemberService;

    @PostMapping("/medkit/{medkitId}")
    public ResponseEntity<MedkitMemberResponse> addMember(
            @PathVariable Long medkitId,
            @Valid @RequestBody MedkitMemberRequest request) {
        MedkitMemberResponse response = medkitMemberService.addMember(medkitId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/medkit/{medkitId}")
    public ResponseEntity<List<MedkitMemberResponse>> getMembersByMedkitId(@PathVariable Long medkitId) {
        List<MedkitMemberResponse> response = medkitMemberService.getMembersByMedkitId(medkitId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MedkitMemberResponse>> getMedkitsByUserId(@PathVariable Long userId) {
        List<MedkitMemberResponse> response = medkitMemberService.getMedkitsByUserId(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/medkit/{medkitId}/user/{userId}")
    public ResponseEntity<MedkitMemberResponse> getMemberByMedkitAndUser(
            @PathVariable Long medkitId,
            @PathVariable Long userId) {
        MedkitMemberResponse response = medkitMemberService.getMemberByMedkitAndUser(medkitId, userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{memberId}/role")
    public ResponseEntity<MedkitMemberResponse> updateMemberRole(
            @PathVariable Long memberId,
            @RequestParam MedkitRole role) {
        MedkitMemberResponse response = medkitMemberService.updateMemberRole(memberId, role);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{memberId}")
    public ResponseEntity<Void> removeMember(@PathVariable Long memberId) {
        medkitMemberService.removeMember(memberId);
        return ResponseEntity.noContent().build();
    }
}
