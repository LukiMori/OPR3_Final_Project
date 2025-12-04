package cz.osu.opr3_final_project.dtos.tmdb;

public record TmdbPersonDetailsDTO (
        Long id,
        String name,
        String biography,
        String birthday
) {
}
