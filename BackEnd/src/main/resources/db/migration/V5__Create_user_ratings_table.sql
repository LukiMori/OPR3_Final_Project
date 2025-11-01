CREATE TABLE user_ratings
(
    id       BIGSERIAL PRIMARY KEY,
    user_id  BIGINT REFERENCES users (id) ON DELETE CASCADE,
    movie_id BIGINT REFERENCES movies (id) ON DELETE CASCADE,
    rating   INT NOT NULL CHECK (rating >= 1 AND rating <= 10),
    UNIQUE (user_id, movie_id)
);