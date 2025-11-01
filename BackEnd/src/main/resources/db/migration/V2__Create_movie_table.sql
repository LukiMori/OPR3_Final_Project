CREATE TABLE movies
(
    ID          BIGINT PRIMARY KEY,
    Title       varchar(255),
    Genre       varchar(255),
    ReleaseYear int,
    Rating DOUBLE PRECISION,
    Description varchar(1000),
    PosterURL   varchar(500)
);
CREATE TABLE movies_directors
(
    person_id BIGINT REFERENCES persons (ID) ON DELETE CASCADE,
    movie_id  BIGINT REFERENCES movies (ID) ON DELETE CASCADE,
    PRIMARY KEY (person_id, movie_id)
);
CREATE TABLE movies_actors
(
    person_id BIGINT REFERENCES persons (ID) ON DELETE CASCADE,
    movie_id  BIGINT REFERENCES movies (ID) ON DELETE CASCADE,
    PRIMARY KEY (person_id, movie_id)
);