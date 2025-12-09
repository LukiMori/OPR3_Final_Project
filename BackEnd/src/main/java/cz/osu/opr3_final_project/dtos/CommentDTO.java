package cz.osu.opr3_final_project.dtos;



public record CommentDTO(
        Long id,
        String username,
        String content,
        String timestamp,
        String movieTitle,
        Long movieId
) {}