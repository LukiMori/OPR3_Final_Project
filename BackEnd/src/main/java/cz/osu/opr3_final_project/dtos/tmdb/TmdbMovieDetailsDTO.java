package cz.osu.opr3_final_project.dtos.tmdb;


import java.util.List;

public record TmdbMovieDetailsDTO (
        Long id,
        String title,
        String releaseDate,
        String description,
        List<TmdbMovieDetailsDirectorDTO> directors,
        List<TmdbMovieDetailsActorDTO> actors,
        List<String> genre,
        Long voteTotal,
        Integer voteCount,
        Double rating,
        String posterUrl
) {
}
