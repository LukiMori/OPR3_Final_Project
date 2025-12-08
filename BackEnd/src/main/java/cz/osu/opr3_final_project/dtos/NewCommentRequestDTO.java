package cz.osu.opr3_final_project.dtos;

public record NewCommentRequestDTO(
    Long userId,
    String content
) {}