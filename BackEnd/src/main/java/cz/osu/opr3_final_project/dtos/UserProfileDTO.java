package cz.osu.opr3_final_project.dtos;

import java.util.List;

public record UserProfileDTO(
        Long id,
        String username,
        int totalFavorites,
        int totalComments,
        List<MovieSummaryDTO> favoriteMovies,
        List<CommentDTO> Comments
) {}