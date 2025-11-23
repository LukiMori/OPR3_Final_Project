CREATE TABLE movies
(
    id          BIGINT PRIMARY KEY,
    title       VARCHAR(255),
    release_date VARCHAR(50),
    description VARCHAR(1000),
    poster_url   VARCHAR(500),
    vote_total   BIGINT NOT NULL DEFAULT 0,
    vote_count   INT NOT NULL DEFAULT 0,
    rating      DOUBLE PRECISION NOT NULL DEFAULT 0.0
);

CREATE TABLE movies_directors
(
    person_id BIGINT REFERENCES persons (ID) ON DELETE CASCADE,
    movie_id  BIGINT REFERENCES movies (ID) ON DELETE CASCADE,
    PRIMARY KEY (person_id, movie_id)
);
