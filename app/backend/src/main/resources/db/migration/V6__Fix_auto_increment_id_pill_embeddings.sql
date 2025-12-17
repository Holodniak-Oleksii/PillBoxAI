DO $$
BEGIN
    PERFORM setval('pill_embeddings_id_seq', (SELECT MAX(id) FROM pill_embeddings));
END $$;