package cz.osu.opr3_final_project.services;

import cz.osu.opr3_final_project.dtos.CommentDTO;
import cz.osu.opr3_final_project.dtos.MovieSummaryDTO;
import cz.osu.opr3_final_project.dtos.UserProfileDTO;
import cz.osu.opr3_final_project.model.entities.User;
import cz.osu.opr3_final_project.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String hashPassword(String password) {
        return passwordEncoder.encode(password);
    }

    public boolean verifyPassword(String rawPassword, String hashedPassword) {
        return passwordEncoder.matches(rawPassword, hashedPassword);
    }

    public UserProfileDTO getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<MovieSummaryDTO> favoriteMovies = new ArrayList<>();
        List<CommentDTO> recentComments = new ArrayList<>();

        return new UserProfileDTO(
                user.getId(),
                user.getUsername(),
                favoriteMovies.size(),
                recentComments.size(),
                favoriteMovies,
                recentComments
        );
    }
}