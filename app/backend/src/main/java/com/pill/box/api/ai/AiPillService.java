package com.pill.box.api.ai;

import com.pill.box.api.ai.dto.PillScanRequest;
import com.pill.box.api.ai.dto.PillScanResponse;
import com.pill.box.api.ai.dto.PillScanResult;
import com.pill.box.api.exception.ResourceNotFoundException;
import com.pill.box.api.medkit.Medkit;
import com.pill.box.api.medkit.MedkitRepository;
import com.pill.box.api.pill.Pill;
import com.pill.box.api.pill.PillRepository;
import com.pill.box.api.user.User;
import com.pill.box.api.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class AiPillService {

    private final PillImageScannerService scannerService;
    private final PillRepository pillRepository;
    private final MedkitRepository medkitRepository;
    private final UserRepository userRepository;

    @Transactional
    public PillScanResponse scanAndCreatePill(PillScanRequest request, Long userId) {
        try {
            Medkit medkit = medkitRepository.findById(request.getMedkitId())
                    .orElseThrow(() -> new ResourceNotFoundException("Medkit not found with id: " + request.getMedkitId()));
            
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
            
            PillScanResult scanResult = scannerService.scanPillImage(
                    request.getImage(),
                    request.getLanguage()
            );
            
            if (!scanResult.isSuccess()) {
                return PillScanResponse.builder()
                        .scanResult(scanResult)
                        .success(false)
                        .message("Failed to scan image: " + scanResult.getErrorMessage())
                        .build();
            }
            
            Pill pill = createPillFromScanResult(scanResult, medkit, user);
            Pill savedPill = pillRepository.save(pill);
            
            return PillScanResponse.builder()
                    .scanResult(scanResult)
                    .pillId(savedPill.getId())
                    .success(true)
                    .message("Pill scanned and saved successfully")
                    .build();
                    
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            return PillScanResponse.builder()
                    .success(false)
                    .message("Error processing scan: " + e.getMessage())
                    .build();
        }
    }

    public PillScanResult scanOnly(MultipartFile multipartFile, String language) {
        return scannerService.scanPillImage(multipartFile, language);
    }

    private Pill createPillFromScanResult(PillScanResult scanResult, Medkit medkit, User user) {
        Pill pill = new Pill();
        pill.setMedkit(medkit);
        pill.setCreatedBy(user);
        pill.setName(scanResult.getName());
        pill.setActiveSubstance(scanResult.getActiveSubstance());
        pill.setDescription(scanResult.getDescription());
        pill.setUsageInstructions(scanResult.getUsageInstructions());
        pill.setSideEffects(scanResult.getSideEffects());
        pill.setContraindications(scanResult.getContraindications());
        pill.setExpiryDate(scanResult.getExpiryDate());
        pill.setQuantity(scanResult.getQuantity());
        
        return pill;
    }
}
