package cz.osu.opr3_final_project.dtos;

import java.time.Instant;

public record CommentDTO(
        Long id,
        String content,
        Instant timestamp,
        String movieTitle,
        Long movieId
) {}