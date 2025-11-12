package com.pill.box.api.medkit;

import com.pill.box.api.medkit.dto.MedkitRequest;
import com.pill.box.api.medkit.dto.MedkitResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<MedkitResponse> getMedkitById(@PathVariable Long id) {
        MedkitResponse response = medkitService.getMedkitById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<MedkitResponse>> getAllMedkits() {
        List<MedkitResponse> response = medkitService.getAllMedkits();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<MedkitResponse>> getMedkitsByOwnerId(@PathVariable Long ownerId) {
        List<MedkitResponse> response = medkitService.getMedkitsByOwnerId(ownerId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<MedkitResponse>> searchMedkitsByName(@RequestParam String name) {
        List<MedkitResponse> response = medkitService.searchMedkitsByName(name);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedkitResponse> updateMedkit(@PathVariable Long id,
                                                       @Valid @RequestBody MedkitRequest request) {
        MedkitResponse response = medkitService.updateMedkit(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedkit(@PathVariable Long id) {
        medkitService.deleteMedkit(id);
        return ResponseEntity.noContent().build();
    }
}
