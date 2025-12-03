package com.pill.box.api.ai;

import com.pill.box.api.ai.config.JsonbType;
import com.pill.box.api.ai.config.VectorType;
import com.pill.box.api.medkit.Medkit;
import com.pill.box.api.pill.Pill;
import com.pill.box.api.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.Type;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "pill_embeddings")
public class PillEmbedding {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pill_id", nullable = false)
    private Pill pill;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medkit_id", nullable = false)
    private Medkit medkit;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "embedding", columnDefinition = "vector(1536)")
    @Type(VectorType.class)
    private float[] embedding;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;
    
    @Column(columnDefinition = "jsonb")
    @Type(JsonbType.class)
    private String metadata;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
