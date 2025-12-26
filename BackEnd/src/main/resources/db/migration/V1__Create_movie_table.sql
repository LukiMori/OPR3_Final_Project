CREATE TABLE movies
(
    id          BIGINT PRIMARY KEY,
    title       VARCHAR(255),
    release_date VARCHAR(50),
    description VARCHAR(1000),
    poster_url   VARCHAR(500)
);