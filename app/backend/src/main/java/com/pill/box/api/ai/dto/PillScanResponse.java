package com.pill.box.api.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PillScanResponse {
    private PillScanResult scanResult;
    private Long pillId;
    private String message;
    private boolean success;
}
