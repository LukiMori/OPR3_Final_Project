package cz.osu.opr3_final_project.dtos;

public record MovieSummaryDTO(
        Long id,
        String title,
        String posterUrl,
        Integer releaseYear
) {}