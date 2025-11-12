CREATE TABLE IF NOT EXISTS medkits
(
    id          SERIAL PRIMARY KEY,
    owner_id    BIGINT       NOT NULL,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    icon        VARCHAR(50),
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_medkits_owner FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS medkit_members
(
    id         SERIAL PRIMARY KEY,
    medkit_id  BIGINT      NOT NULL,
    user_id    BIGINT      NOT NULL,
    role       VARCHAR(20) NOT NULL,
    created_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_medkit_members_medkit FOREIGN KEY (medkit_id) REFERENCES medkits (id) ON DELETE CASCADE,
    CONSTRAINT fk_medkit_members_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT uq_medkit_user UNIQUE (medkit_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_medkit_members_user_id ON medkit_members (user_id);