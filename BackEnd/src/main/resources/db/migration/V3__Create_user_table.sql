CREATE TABLE users
(
    ID       BIGSERIAL PRIMARY KEY,
    username varchar(255) NOT NULL UNIQUE,
    password varchar(255) NOT NULL
);
CREATE TABLE users_favourite_movies
(
    user_id  BIGINT REFERENCES users (ID) ON DELETE CASCADE,
    movie_id BIGINT REFERENCES movies (ID) ON DELETE CASCADE,
    PRIMARY KEY (user_id, movie_id)
);