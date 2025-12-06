CREATE TABLE IF NOT EXISTS pills
(
    id                   BIGSERIAL PRIMARY KEY,
    medkit_id            BIGINT       NOT NULL,
    name                 VARCHAR(255) NOT NULL,
    description          TEXT,
    expiry_date          DATE         NOT NULL,
    quantity             INTEGER,
    created_by           BIGINT,
    created_at           TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pills_medkit FOREIGN KEY (medkit_id) REFERENCES medkits (id) ON DELETE CASCADE,
    CONSTRAINT fk_pills_created_by FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_pills_medkit_id ON pills (medkit_id);
CREATE INDEX IF NOT EXISTS idx_pills_name ON pills (name);
