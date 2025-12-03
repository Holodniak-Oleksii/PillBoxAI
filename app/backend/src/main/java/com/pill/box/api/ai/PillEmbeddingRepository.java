package com.pill.box.api.ai;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PillEmbeddingRepository extends JpaRepository<PillEmbedding, Long> {
    
    Optional<PillEmbedding> findByPillId(Long pillId);
    
    List<PillEmbedding> findByMedkitId(Long medkitId);
    
    List<PillEmbedding> findByUserId(Long userId);
    
    @Query(value = """
        SELECT pe.* FROM pill_embeddings pe
        WHERE pe.medkit_id = :medkitId
        ORDER BY pe.embedding <=> CAST(:queryEmbedding AS vector)
        LIMIT :limit
        """, nativeQuery = true)
    List<PillEmbedding> findSimilarByMedkit(
        @Param("medkitId") Long medkitId,
        @Param("queryEmbedding") String queryEmbedding,
        @Param("limit") int limit
    );
    
    @Query(value = """
        SELECT pe.* FROM pill_embeddings pe
        WHERE pe.medkit_id IN :medkitIds
        ORDER BY pe.embedding <=> CAST(:queryEmbedding AS vector)
        LIMIT :limit
        """, nativeQuery = true)
    List<PillEmbedding> findSimilarByMedkits(
        @Param("medkitIds") List<Long> medkitIds,
        @Param("queryEmbedding") String queryEmbedding,
        @Param("limit") int limit
    );
    
    @Query(value = """
        SELECT pe.* FROM pill_embeddings pe
        WHERE pe.user_id = :userId
        ORDER BY pe.embedding <=> CAST(:queryEmbedding AS vector)
        LIMIT :limit
        """, nativeQuery = true)
    List<PillEmbedding> findSimilarByUser(
        @Param("userId") Long userId,
        @Param("queryEmbedding") String queryEmbedding,
        @Param("limit") int limit
    );
    
    void deleteByPillId(Long pillId);
    
    void deleteByMedkitId(Long medkitId);
}
