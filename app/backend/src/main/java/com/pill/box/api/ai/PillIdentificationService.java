package com.pill.box.api.ai;

import lombok.RequiredArgsConstructor;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pill.box.api.ai.dto.IdentifiedPill;
import com.pill.box.api.exception.AiProcessingException;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeType;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class PillIdentificationService {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    private static final String IDENTIFICATION_PROMPT_TEMPLATE = """
            Analyze the images of pills or blister packs and identify which medications they are.
            For each image provided, using the information extracted from the image (shape, color, markings, logos, text on packaging), create a JSON object.
            Return an array of JSON objects in the following format:
            
            [
              {
                "name": "medication name",
                "description": "brief information about when this medication is used",
                "expiryDate": "expiry date in YYYY-MM-DD",
                "quantity": "number of tablets",
               }
            ]
            
            IMPORTANT LANGUAGE REQUIREMENT:
            - Write the "name" field (medication name) in %s language
            - Write the "description" field (medication description) in %s language
            - Keep the "expiryDate" in YYYY-MM-DD format (numbers only)
            - Keep the "quantity" as a number
            
            If any field cannot be determined, set it to null.
            Respond ONLY with valid JSON array without additional explanations or markdown formatting.
            """;

    public List<IdentifiedPill> identifyFromImages(List<MultipartFile> imageFiles, String language) {
        validateImages(imageFiles);
        String aiResponse = chatClient.prompt()
                .user(userSpec -> buildAiPromptWithImages(userSpec, imageFiles, language))
                .call()
                .content();
        return parseIdentificationResults(aiResponse);
    }

    private void validateImages(List<MultipartFile> imageFiles) {
        if (imageFiles == null || imageFiles.isEmpty()) {
            throw new AiProcessingException("No images provided for identification");
        }
    }

    private void buildAiPromptWithImages(ChatClient.PromptUserSpec userSpec, List<MultipartFile> imageFiles, String language) {
        String languageFullName = getLanguageFullName(language);
        String prompt = String.format(IDENTIFICATION_PROMPT_TEMPLATE, languageFullName, languageFullName);
        userSpec.text(prompt);

        attachImagesToPrompt(userSpec, imageFiles);
    }

    private void attachImagesToPrompt(ChatClient.PromptUserSpec userSpec, List<MultipartFile> imageFiles) {
        for (MultipartFile imageFile : imageFiles) {
            try {
                InputStreamResource imageResource = new InputStreamResource(imageFile.getInputStream());
                MimeType mimeType = resolveMimeType(imageFile);
                userSpec.media(mimeType, imageResource);
            } catch (IOException e) {
                throw new AiProcessingException("Failed to process image: " + e.getMessage(), e);
            }
        }
    }

    private MimeType resolveMimeType(MultipartFile file) {
        String mimeType = file.getContentType();
        if (mimeType == null) {
            mimeType = MimeTypeUtils.IMAGE_PNG_VALUE;
        }
        return MimeTypeUtils.parseMimeType(mimeType);
    }

    private List<IdentifiedPill> parseIdentificationResults(String response) {
        try {
            String jsonString = extractJsonArray(response);
            JsonNode jsonArray = objectMapper.readTree(jsonString);

            if (!jsonArray.isArray()) {
                throw new AiProcessingException("Expected JSON array in AI response");
            }

            List<IdentifiedPill> results = new ArrayList<>(jsonArray.size());
            for (JsonNode jsonNode : jsonArray) {
                IdentifiedPill result = IdentifiedPill.builder()
                        .name(getTextValue(jsonNode, "name"))
                        .description(getTextValue(jsonNode, "description"))
                        .expiryDate(parseExpiryDate(getTextValue(jsonNode, "expiryDate")))
                        .quantity(getIntValue(jsonNode, "quantity"))
                        .build();
                results.add(result);
            }

            return results;
        } catch (JsonProcessingException e) {
            throw new AiProcessingException("Failed to parse AI response: " + e.getMessage());
        }
    }

    private String extractJsonArray(String text) {
        Pattern pattern = Pattern.compile("\\[.*\\]", Pattern.DOTALL);
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
            return LocalDate.parse(dateString, formatter);
        }
        return null;
    }

    private String getLanguageFullName(String languageCode) {
        if (languageCode == null) {
            return "English";
        }
        return switch (languageCode.toLowerCase()) {
            case "uk", "ua" -> "Ukrainian";
            default -> "English";
        };
    }
}
