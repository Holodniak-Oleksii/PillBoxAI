package com.pill.box.api.exception.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ErrorResponse {
    private int status;
    private String message;
    private String details;

    @Override
    public String toString() {
        return "ErrorResponse{" +
                "status=" + status +
                ", message='" + message + '\'' +
                ", details='" + details + '\'' +
                '}';
    }
}
