package com.pill.box.api.medkit;

import com.pill.box.api.medkit.dto.MedkitRequest;
import com.pill.box.api.medkit.dto.MedkitResponse;
import com.pill.box.api.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/medkits")
public class MedkitController {

    private final MedkitService medkitService;

    @PostMapping
    public ResponseEntity<MedkitResponse> createMedkit(@RequestParam Long ownerId,
                                                       @Valid @RequestBody MedkitRequest request) {
        MedkitResponse response = medkitService.createMedkit(ownerId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedkitResponse> getMedkitById(@PathVariable Long id,
                                                        @AuthenticationPrincipal User user) {
        MedkitResponse response = medkitService.getMedkitById(id, user.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<MedkitResponse>> getAllMedkits(@AuthenticationPrincipal User user) {
        List<MedkitResponse> response = medkitService.getMedkitsByUserId(user.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<MedkitResponse>> searchMedkitsByName(@RequestParam String name,
                                                                     @AuthenticationPrincipal User user) {
        List<MedkitResponse> response = medkitService.searchMedkitsByName(name, user.getId());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedkitResponse> updateMedkit(@PathVariable Long id,
                                                       @Valid @RequestBody MedkitRequest request,
                                                       @AuthenticationPrincipal User user) {
        MedkitResponse response = medkitService.updateMedkit(id, request, user.getId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedkit(@PathVariable Long id,
                                             @AuthenticationPrincipal User user) {
        medkitService.deleteMedkit(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}
