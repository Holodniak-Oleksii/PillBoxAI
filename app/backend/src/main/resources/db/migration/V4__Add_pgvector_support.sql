CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE pill_embeddings (
    id BIGSERIAL PRIMARY KEY,
    pill_id BIGINT NOT NULL REFERENCES pills(id) ON DELETE CASCADE,
    medkit_id BIGINT NOT NULL REFERENCES medkits(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    embedding vector(1536),
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(pill_id)
);

CREATE INDEX pill_embeddings_vector_idx ON pill_embeddings 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX pill_embeddings_medkit_idx ON pill_embeddings(medkit_id);
CREATE INDEX pill_embeddings_user_idx ON pill_embeddings(user_id);
CREATE INDEX pill_embeddings_user_medkit_idx ON pill_embeddings(user_id, medkit_id);

CREATE INDEX pill_embeddings_pill_idx ON pill_embeddings(pill_id);
