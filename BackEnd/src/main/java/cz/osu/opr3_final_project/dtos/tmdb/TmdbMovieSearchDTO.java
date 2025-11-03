package cz.osu.opr3_final_project.dtos.tmdb;

public record TmdbMovieSearchDTO(
        Long id,
        String title,
        String overview,
        String posterPath,
        String backdropPath,
        String releaseDate
) {}