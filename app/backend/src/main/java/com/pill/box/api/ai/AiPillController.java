package com.pill.box.api.ai;

import com.pill.box.api.ai.dto.IdentifiedPill;
import com.pill.box.api.ai.dto.PillRecommendationRequest;
import com.pill.box.api.ai.dto.PillRecommendationResponse;
import com.pill.box.api.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiPillController {

    private final AiPillService aiPillService;

    @PostMapping("/pills/identify")
    public ResponseEntity<List<IdentifiedPill>> identifyPillsFromImages(
            @RequestParam List<MultipartFile> images,
            @RequestParam(defaultValue = "en") String language) {

        List<IdentifiedPill> results = aiPillService.identifyPills(images, language);
        return ResponseEntity.ok(results);
    }

    @PostMapping("/pills/recommend")
    public ResponseEntity<PillRecommendationResponse> getPillRecommendations(
            @Valid @RequestBody PillRecommendationRequest request,
            @AuthenticationPrincipal User user) {

        PillRecommendationResponse response = aiPillService.getRecommendations(request, user.getId());
        return ResponseEntity.ok(response);
    }
}
