package com.pill.box.api.medkit.member;

import com.pill.box.api.exception.ResourceNotFoundException;
import com.pill.box.api.medkit.Medkit;
import com.pill.box.api.medkit.MedkitRepository;
import com.pill.box.api.medkit.MedkitRole;
import com.pill.box.api.medkit.member.dto.MedkitMemberRequest;
import com.pill.box.api.medkit.member.dto.MedkitMemberResponse;
import com.pill.box.api.user.User;
import com.pill.box.api.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedkitMemberService {

    private final MedkitMemberRepository medkitMemberRepository;
    private final MedkitRepository medkitRepository;
    private final UserRepository userRepository;
    private final MedkitMemberMapper medkitMemberMapper;

    @Transactional
    public MedkitMemberResponse addMember(Long medkitId, MedkitMemberRequest request) {
        Medkit medkit = medkitRepository.findById(medkitId)
                .orElseThrow(() -> new ResourceNotFoundException("Medkit not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (medkitMemberRepository.existsByMedkitIdAndUserId(medkitId, request.getUserId())) {
            throw new IllegalStateException("User is already a member of this medkit");
        }

        MedkitMember member = medkitMemberMapper.toEntity(request, medkit, user);
        MedkitMember savedMember = medkitMemberRepository.save(member);
        return medkitMemberMapper.toResponse(savedMember);
    }

    @Transactional(readOnly = true)
    public List<MedkitMemberResponse> getMembersByMedkitId(Long medkitId) {
        return medkitMemberRepository.findByMedkitId(medkitId).stream()
                .map(medkitMemberMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MedkitMemberResponse> getMedkitsByUserId(Long userId) {
        return medkitMemberRepository.findByUserId(userId).stream()
                .map(medkitMemberMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MedkitMemberResponse getMemberByMedkitAndUser(Long medkitId, Long userId) {
        MedkitMember member = medkitMemberRepository.findByMedkitIdAndUserId(medkitId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));
        return medkitMemberMapper.toResponse(member);
    }

    @Transactional
    public MedkitMemberResponse updateMemberRole(Long memberId, MedkitRole newRole) {
        MedkitMember member = medkitMemberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));
        
        member.setRole(newRole);
        MedkitMember updatedMember = medkitMemberRepository.save(member);
        return medkitMemberMapper.toResponse(updatedMember);
    }

    @Transactional
    public void removeMember(Long memberId) {
        if (!medkitMemberRepository.existsById(memberId)) {
            throw new ResourceNotFoundException("Member not found");
        }
        medkitMemberRepository.deleteById(memberId);
    }
}
