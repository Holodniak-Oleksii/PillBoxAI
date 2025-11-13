package com.pill.box.api.pill;

import com.pill.box.api.pill.dto.PillRequest;
import com.pill.box.api.pill.dto.PillResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/pills")
public class PillController {

    private final PillService pillService;

    @PostMapping
    public ResponseEntity<PillResponse> createPill(@RequestParam Long medkitId,
                                                   @RequestParam Long createdById,
                                                   @Valid @RequestBody PillRequest request) {
        PillResponse response = pillService.createPill(medkitId, createdById, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PillResponse> getPillById(@PathVariable Long id) {
        PillResponse response = pillService.getPillById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<PillResponse>> getAllPills() {
        List<PillResponse> response = pillService.getAllPills();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/medkit/{medkitId}")
    public ResponseEntity<List<PillResponse>> getPillsByMedkitId(@PathVariable Long medkitId) {
        List<PillResponse> response = pillService.getPillsByMedkitId(medkitId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<PillResponse>> searchPillsByName(@RequestParam String name) {
        List<PillResponse> response = pillService.searchPillsByName(name);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PillResponse> updatePill(@PathVariable Long id,
                                                   @Valid @RequestBody PillRequest request) {
        PillResponse response = pillService.updatePill(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePill(@PathVariable Long id) {
        pillService.deletePill(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/take")
    public ResponseEntity<PillResponse> takePill(@PathVariable Long id,
                                                 @RequestParam Integer quantity) {
        PillResponse response = pillService.takePill(id, quantity);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/add")
    public ResponseEntity<PillResponse> addQuantity(@PathVariable Long id,
                                                    @RequestParam Integer quantity) {
        PillResponse response = pillService.addQuantity(id, quantity);
        return ResponseEntity.ok(response);
    }
}
