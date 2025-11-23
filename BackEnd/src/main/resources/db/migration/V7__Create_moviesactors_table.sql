CREATE TABLE movies_actors
(
    id             BIGSERIAL PRIMARY KEY,
    person_id      BIGINT REFERENCES persons (id) ON DELETE CASCADE,
    movie_id       BIGINT REFERENCES movies (id) ON DELETE CASCADE,
    character_name VARCHAR(255),
    UNIQUE (person_id, movie_id, character_name)
);