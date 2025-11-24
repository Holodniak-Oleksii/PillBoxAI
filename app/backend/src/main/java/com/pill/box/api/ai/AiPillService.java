package com.pill.box.api.ai;

import com.pill.box.api.ai.dto.IdentifiedPill;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AiPillService {

    private final PillIdentificationService scannerService;

    public List<IdentifiedPill> identifyPills(List<MultipartFile> images, String language) {
        return scannerService.identifyFromImages(images, language);
    }
}
