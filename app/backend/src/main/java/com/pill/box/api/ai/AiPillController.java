package com.pill.box.api.ai;

import com.pill.box.api.ai.dto.PillScanRequest;
import com.pill.box.api.ai.dto.PillScanResponse;
import com.pill.box.api.ai.dto.PillScanResult;
import com.pill.box.api.user.User;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiPillController {

    private final AiPillService aiPillService;

    @PostMapping("/scan")
    public ResponseEntity<PillScanResponse> scanAndCreatePill(
            @Valid @RequestBody PillScanRequest request,
            @AuthenticationPrincipal User user) {

        PillScanResponse response = aiPillService.scanAndCreatePill(request, user.getId());

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/scan/preview")
    public ResponseEntity<PillScanResult> previewScan(
            @RequestParam MultipartFile image,
            @RequestParam(defaultValue = "uk") String language) {

        PillScanResult result = aiPillService.scanOnly(image, language);

        if (result.isSuccess()) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    @GetMapping("/health")
    @Operation(summary = "Check AI service health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("AI service is operational");
    }
}
