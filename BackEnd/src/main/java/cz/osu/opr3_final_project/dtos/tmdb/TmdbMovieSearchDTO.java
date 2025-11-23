package cz.osu.opr3_final_project.dtos.tmdb;

public record TmdbMovieSearchDTO(
        Long id,
        String title,
        String releaseYear,
        String posterPath
) {}