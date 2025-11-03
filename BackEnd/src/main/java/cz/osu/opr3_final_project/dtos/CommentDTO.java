package cz.osu.opr3_final_project.dtos;

import java.time.LocalDateTime;

public record CommentDTO(
        Long id,
        String content,
        LocalDateTime createdAt,
        String movieTitle,
        Long movieId
) {}