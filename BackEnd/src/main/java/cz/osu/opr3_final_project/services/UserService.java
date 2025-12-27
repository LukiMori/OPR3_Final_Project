package cz.osu.opr3_final_project.services;

import cz.osu.opr3_final_project.dtos.CommentDTO;
import cz.osu.opr3_final_project.dtos.MovieSummaryDTO;
import cz.osu.opr3_final_project.dtos.UserProfileDTO;
import cz.osu.opr3_final_project.model.entities.User;
import cz.osu.opr3_final_project.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
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
                .orElseThrow(() -> new RuntimeException("User not found"));  // Controller handles this

        List<MovieSummaryDTO> favoriteMovies = new ArrayList<>();

        if (user.getFavouriteMovies() != null) {
            user.getFavouriteMovies().forEach(movie -> {
                try {
                    Integer year = null;
                    if (movie.getReleaseDate() != null && movie.getReleaseDate().length() >= 4) {
                        String yearString = movie.getReleaseDate().substring(0, 4);
                        try {
                            year = Integer.parseInt(yearString);
                        } catch (NumberFormatException e) {
                            logger.warn("Invalid year format in release date: {}", movie.getReleaseDate());
                            year = null;
                        }
                    }

                    favoriteMovies.add(new MovieSummaryDTO(
                            movie.getId(),
                            movie.getTitle(),
                            movie.getPosterUrl(),
                            year != null ? year : 0
                    ));
                } catch (Exception e) {
                    logger.error("Error processing movie {}: {}", movie.getId(), e.getMessage());
                }
            });
        }

        List<CommentDTO> comments = new ArrayList<>();

        if (user.getComments() != null) {
            user.getComments().forEach(comment -> {
                try {
                    comments.add(new CommentDTO(
                            comment.getId(),
                            comment.getUser().getUsername(),
                            comment.getContent(),
                            comment.getTimestamp().toString(),
                            comment.getMovie().getTitle(),
                            comment.getMovie().getId()
                    ));
                } catch (Exception e) {
                    logger.error("Error processing comment {}: {}", comment.getId(), e.getMessage());
                }
            });
        }

        return new UserProfileDTO(
                user.getId(),
                user.getUsername(),
                favoriteMovies.size(),
                comments.size(),
                favoriteMovies,
                comments
        );
    }
}