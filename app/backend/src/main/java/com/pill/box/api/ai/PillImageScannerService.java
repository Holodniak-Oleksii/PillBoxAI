package com.pill.box.api.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pill.box.api.ai.dto.PillScanResult;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeType;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class PillImageScannerService {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    private static final String SCAN_PROMPT_TEMPLATE = """
            Analyze the image of a pill or blister pack and identify which medication it is.
            Using the information extracted from the image (shape, color, markings, logos, text on packaging), fill in the following fields in JSON format:
            
            {
              "name": "medication name",
              "description": "brief information about when this medication is used",
              "expiryDate": "expiry date in YYYY-MM-DD",
              "quantity": "number of tablets",
              "confidence": "confidence level from 0.0 to 1.0 in identifying the medication"
            }
            
            If any field cannot be determined, set it to null.
            Respond ONLY with valid JSON without additional explanations.
            Response language: %s
            """;

    public PillScanResult scanPillImage(MultipartFile imageFile, String language) {
        try {
            String prompt = String.format(SCAN_PROMPT_TEMPLATE, language != null ? language : "uk");

            InputStreamResource imageResource = new InputStreamResource(imageFile.getInputStream());

            String mimeType = imageFile.getContentType();
            if (mimeType == null) {
                mimeType = MimeTypeUtils.IMAGE_PNG_VALUE;
            }
            MimeType mimeTypeO = org.springframework.util.MimeTypeUtils.parseMimeType(mimeType);
            String response = chatClient.prompt()
                    .user(userSpec -> userSpec
                            .text(prompt)
                            .media(mimeTypeO, imageResource))
                    .call()
                    .content();

            return parseAiResponse(response);

        } catch (Exception e) {
            return PillScanResult.builder()
                    .success(false)
                    .errorMessage("Failed to scan image: " + e.getMessage())
                    .confidence(0.0)
                    .build();
        }
    }

    private PillScanResult parseAiResponse(String response) {
        try {
            String jsonString = extractJson(response);
            JsonNode jsonNode = objectMapper.readTree(jsonString);

            PillScanResult result = PillScanResult.builder()
                    .name(getTextValue(jsonNode, "name"))
                    .description(getTextValue(jsonNode, "description"))
                    .expiryDate(parseExpiryDate(getTextValue(jsonNode, "expiryDate")))
                    .quantity(getIntValue(jsonNode, "quantity"))
                    .confidence(getDoubleValue(jsonNode, "confidence"))
                    .success(true)
                    .build();

            if (result.getName() == null || result.getName().trim().isEmpty()) {
                result.setSuccess(false);
                result.setErrorMessage("Could not extract medication name from image");
                result.setConfidence(0.0);
            }

            return result;

        } catch (Exception e) {
            return PillScanResult.builder()
                    .success(false)
                    .errorMessage("Failed to parse AI response: " + e.getMessage())
                    .confidence(0.0)
                    .build();
        }
    }

    private String extractJson(String text) {
        Pattern pattern = Pattern.compile("\\{[^{}]*(?:\\{[^{}]*\\}[^{}]*)*\\}", Pattern.DOTALL);
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            return matcher.group();
        }
        return text;
    }

    private String getTextValue(JsonNode node, String fieldName) {
        JsonNode fieldNode = node.get(fieldName);
        if (fieldNode != null && !fieldNode.isNull() && fieldNode.isTextual()) {
            String value = fieldNode.asText();
            return value.isEmpty() ? null : value;
        }
        return null;
    }

    private Integer getIntValue(JsonNode node, String fieldName) {
        JsonNode fieldNode = node.get(fieldName);
        if (fieldNode != null && !fieldNode.isNull() && fieldNode.isNumber()) {
            return fieldNode.asInt();
        }
        return null;
    }

    private Double getDoubleValue(JsonNode node, String fieldName) {
        JsonNode fieldNode = node.get(fieldName);
        if (fieldNode != null && !fieldNode.isNull() && fieldNode.isNumber()) {
            return fieldNode.asDouble();
        }
        return 0.7;
    }

    private LocalDate parseExpiryDate(String dateString) {
        if (dateString == null || dateString.trim().isEmpty()) {
            return null;
        }

        List<DateTimeFormatter> formatters = List.of(
                DateTimeFormatter.ISO_LOCAL_DATE,
                DateTimeFormatter.ofPattern("dd.MM.yyyy"),
                DateTimeFormatter.ofPattern("dd/MM/yyyy"),
                DateTimeFormatter.ofPattern("MM/yyyy"),
                DateTimeFormatter.ofPattern("MM.yyyy")
        );

        for (DateTimeFormatter formatter : formatters) {
            try {
                return LocalDate.parse(dateString, formatter);
            } catch (DateTimeParseException e) {
            }
        }

        return null;
    }
}
