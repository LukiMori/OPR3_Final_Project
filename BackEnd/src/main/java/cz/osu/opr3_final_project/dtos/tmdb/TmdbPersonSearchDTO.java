package cz.osu.opr3_final_project.dtos.tmdb;

public record TmdbPersonSearchDTO(
        Long id,
        String name,
        String profilePath,
        String knownForDepartment
) {}