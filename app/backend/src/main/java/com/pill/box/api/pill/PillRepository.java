package com.pill.box.api.pill;

import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface PillRepository extends CrudRepository<Pill, Long> {
    List<Pill> findByMedkitId(Long medkitId);
    List<Pill> findByNameContainingIgnoreCase(String name);
}
