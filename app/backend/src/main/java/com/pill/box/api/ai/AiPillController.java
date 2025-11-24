package com.pill.box.api.ai;

import com.pill.box.api.ai.dto.IdentifiedPill;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
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
}
