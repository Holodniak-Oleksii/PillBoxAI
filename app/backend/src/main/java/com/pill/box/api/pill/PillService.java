package com.pill.box.api.pill;

import com.pill.box.api.exception.ResourceNotFoundException;
import com.pill.box.api.medkit.Medkit;
import com.pill.box.api.medkit.MedkitRepository;
import com.pill.box.api.pill.dto.PillRequest;
import com.pill.box.api.pill.dto.PillResponse;
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
public class PillService {

    private final PillRepository pillRepository;
    private final MedkitRepository medkitRepository;
    private final UserRepository userRepository;
    private final PillMapper pillMapper;

    @Transactional
    public PillResponse createPill(Long medkitId, Long createdById, PillRequest request) {
        Medkit medkit = medkitRepository.findById(medkitId)
                .orElseThrow(() -> new ResourceNotFoundException("Medkit not found"));
        
        User createdBy = userRepository.findById(createdById)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Pill pill = pillMapper.toEntity(request, medkit, createdBy);
        Pill savedPill = pillRepository.save(pill);
        return pillMapper.toResponse(savedPill);
    }

    @Transactional(readOnly = true)
    public PillResponse getPillById(Long id) {
        Pill pill = pillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pill not found"));
        return pillMapper.toResponse(pill);
    }

    @Transactional(readOnly = true)
    public List<PillResponse> getAllPills() {
        return StreamSupport.stream(pillRepository.findAll().spliterator(), false)
                .map(pillMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PillResponse> getPillsByMedkitId(Long medkitId) {
        return pillRepository.findByMedkitId(medkitId).stream()
                .map(pillMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PillResponse> searchPillsByName(String name) {
        return pillRepository.findByNameContainingIgnoreCase(name).stream()
                .map(pillMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PillResponse updatePill(Long id, PillRequest request) {
        Pill pill = pillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pill not found"));
        
        pillMapper.updateEntity(pill, request);
        Pill updatedPill = pillRepository.save(pill);
        return pillMapper.toResponse(updatedPill);
    }

    @Transactional
    public void deletePill(Long id) {
        if (!pillRepository.existsById(id)) {
            throw new ResourceNotFoundException("Pill not found");
        }
        pillRepository.deleteById(id);
    }

    @Transactional
    public PillResponse takePill(Long id, Integer quantity) {
        Pill pill = pillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pill not found"));
        
        if (pill.getQuantity() == null) {
            throw new IllegalStateException("Cannot take pill: quantity is not set");
        }
        
        if (pill.getQuantity() < quantity) {
            throw new IllegalArgumentException("Not enough pills. Available: " + pill.getQuantity() + ", requested: " + quantity);
        }
        
        pill.setQuantity(pill.getQuantity() - quantity);
        Pill updatedPill = pillRepository.save(pill);
        return pillMapper.toResponse(updatedPill);
    }

    @Transactional
    public PillResponse addQuantity(Long id, Integer quantity) {
        Pill pill = pillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pill not found"));
        
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }
        
        int currentQuantity = pill.getQuantity() != null ? pill.getQuantity() : 0;
        pill.setQuantity(currentQuantity + quantity);
        Pill updatedPill = pillRepository.save(pill);
        return pillMapper.toResponse(updatedPill);
    }
}
