package com.pill.box.api.medkit;

import com.pill.box.api.exception.ResourceNotFoundException;
import com.pill.box.api.medkit.dto.MedkitRequest;
import com.pill.box.api.medkit.dto.MedkitResponse;
import com.pill.box.api.medkit.member.MedkitMemberRepository;
import com.pill.box.api.user.User;
import com.pill.box.api.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedkitService {

    private final MedkitRepository medkitRepository;
    private final MedkitMemberRepository medkitMemberRepository;
    private final UserRepository userRepository;
    private final MedkitMapper medkitMapper;

    @Transactional
    public MedkitResponse createMedkit(Long ownerId, MedkitRequest request) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Medkit medkit = medkitMapper.toEntity(request, owner);
        Medkit savedMedkit = medkitRepository.save(medkit);
        return medkitMapper.toResponse(savedMedkit);
    }

    @Transactional(readOnly = true)
    public MedkitResponse getMedkitById(Long id, Long userId) {
        Medkit medkit = medkitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medkit not found"));
        
        validateUserAccess(id, userId);
        return medkitMapper.toResponse(medkit);
    }

    @Transactional(readOnly = true)
    public List<MedkitResponse> getMedkitsByUserId(Long userId) {
        return medkitRepository.findAllAccessibleByUserId(userId).stream()
                .map(medkitMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MedkitResponse> searchMedkitsByName(String name, Long userId) {
        return medkitRepository.findAccessibleByUserIdAndNameContaining(userId, name).stream()
                .map(medkitMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public MedkitResponse updateMedkit(Long id, MedkitRequest request, Long userId) {
        Medkit medkit = medkitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medkit not found"));
        
        validateUserEditAccess(id, userId);
        medkitMapper.updateEntity(medkit, request);
        Medkit updatedMedkit = medkitRepository.save(medkit);
        return medkitMapper.toResponse(updatedMedkit);
    }

    @Transactional
    public void deleteMedkit(Long id, Long userId) {
        Medkit medkit = medkitRepository.findByIdAndOwnerId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Medkit not found or access denied"));
        
        medkitRepository.delete(medkit);
    }
    
    private void validateUserAccess(Long medkitId, Long userId) {
        if (!medkitRepository.hasUserAccess(medkitId, userId)) {
            throw new AccessDeniedException("You do not have access to this medkit");
        }
    }
    
    private void validateUserEditAccess(Long medkitId, Long userId) {
        if (!medkitRepository.hasUserEditAccess(medkitId, userId)) {
            throw new AccessDeniedException("You do not have permission to edit this medkit");
        }
    }
}
