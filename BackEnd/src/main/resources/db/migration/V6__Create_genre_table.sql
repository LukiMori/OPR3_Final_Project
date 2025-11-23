CREATE TABLE genre
(
    id   BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE movies_genre
(
    movie_id BIGINT REFERENCES movies (ID) ON DELETE CASCADE,
    genre_id BIGINT REFERENCES genre (id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, genre_id)
);