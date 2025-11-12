package com.pill.box.api.medkit.member;

import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface MedkitMemberRepository extends CrudRepository<MedkitMember, Long> {
    List<MedkitMember> findByMedkitId(Long medkitId);
    List<MedkitMember> findByUserId(Long userId);
    Optional<MedkitMember> findByMedkitIdAndUserId(Long medkitId, Long userId);
    boolean existsByMedkitIdAndUserId(Long medkitId, Long userId);
}
