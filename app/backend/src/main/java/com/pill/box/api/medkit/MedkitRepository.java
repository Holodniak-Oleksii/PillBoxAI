package com.pill.box.api.medkit;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MedkitRepository extends CrudRepository<Medkit, Long> {

    @Query("""
            SELECT DISTINCT m
            FROM Medkit m
            LEFT JOIN MedkitMember mm ON m.id = mm.medkit.id
            WHERE m.owner.id = :userId OR mm.user.id = :userId
            """)
    List<Medkit> findAllAccessibleByUserId(@Param("userId") Long userId);

    @Query("""
            SELECT DISTINCT m
            FROM Medkit m
            LEFT JOIN MedkitMember mm ON m.id = mm.medkit.id
            WHERE (m.owner.id = :userId OR mm.user.id = :userId)
            AND LOWER(m.name) LIKE LOWER(CONCAT('%', :name, '%'))
            """)
    List<Medkit> findAccessibleByUserIdAndNameContaining(@Param("userId") Long userId, @Param("name") String name);

    @Query("""
            SELECT CASE WHEN COUNT(m) > 0 THEN true ELSE false END
            FROM Medkit m
            LEFT JOIN MedkitMember mm ON m.id = mm.medkit.id
            WHERE m.id = :medkitId AND (m.owner.id = :userId OR mm.user.id = :userId)
            """)
    boolean hasUserAccess(@Param("medkitId") Long medkitId, @Param("userId") Long userId);

    @Query("""
            SELECT CASE WHEN COUNT(m) > 0 THEN true ELSE false END
            FROM Medkit m
            LEFT JOIN MedkitMember mm ON m.id = mm.medkit.id
            WHERE m.id = :medkitId
            AND (m.owner.id = :userId OR (mm.user.id = :userId AND mm.role IN ('OWNER', 'EDITOR')))
            """)
    boolean hasUserEditAccess(@Param("medkitId") Long medkitId, @Param("userId") Long userId);

    @Query("""
            SELECT m
            FROM Medkit m
            WHERE m.id = :medkitId AND m.owner.id = :userId
            """)
    Optional<Medkit> findByIdAndOwnerId(@Param("medkitId") Long medkitId, @Param("userId") Long userId);
}
