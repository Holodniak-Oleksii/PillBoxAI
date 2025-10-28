package com.pill.box.api.medkit;

import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface MedkitRepository extends CrudRepository<Medkit, Long> {
    List<Medkit> findByOwnerId(Long ownerId);
    List<Medkit> findByNameContainingIgnoreCase(String name);
}
