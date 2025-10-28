package com.pill.box.api.medkit;

import com.pill.box.api.exception.ResourceNotFoundException;
import com.pill.box.api.medkit.dto.MedkitRequest;
import com.pill.box.api.medkit.dto.MedkitResponse;
import com.pill.box.api.user.User;
import com.pill.box.api.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor
public class MedkitService {

    private final MedkitRepository medkitRepository;
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
    public MedkitResponse getMedkitById(Long id) {
        Medkit medkit = medkitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medkit not found"));
        return medkitMapper.toResponse(medkit);
    }

    @Transactional(readOnly = true)
    public List<MedkitResponse> getAllMedkits() {
        return StreamSupport.stream(medkitRepository.findAll().spliterator(), false)
                .map(medkitMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MedkitResponse> getMedkitsByOwnerId(Long ownerId) {
        return medkitRepository.findByOwnerId(ownerId).stream()
                .map(medkitMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MedkitResponse> searchMedkitsByName(String name) {
        return medkitRepository.findByNameContainingIgnoreCase(name).stream()
                .map(medkitMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public MedkitResponse updateMedkit(Long id, MedkitRequest request) {
        Medkit medkit = medkitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medkit not found"));
        
        medkitMapper.updateEntity(medkit, request);
        Medkit updatedMedkit = medkitRepository.save(medkit);
        return medkitMapper.toResponse(updatedMedkit);
    }

    @Transactional
    public void deleteMedkit(Long id) {
        if (!medkitRepository.existsById(id)) {
            throw new ResourceNotFoundException("Medkit not found");
        }
        medkitRepository.deleteById(id);
    }
}
