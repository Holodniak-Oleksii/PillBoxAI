package com.pill.box.api.ai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class PillScanRequest {
    @NotBlank(message = "Image data is required")
    private MultipartFile image;
    private Long medkitId;
    private String language = "uk";
}
