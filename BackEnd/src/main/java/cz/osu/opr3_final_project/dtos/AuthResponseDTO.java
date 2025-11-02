package cz.osu.opr3_final_project.dtos;

public record AuthResponseDTO(
        Long id,
        String username,
        String token
) {}
