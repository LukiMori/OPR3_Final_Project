package cz.osu.opr3_final_project.controllers;

import cz.osu.opr3_final_project.dtos.CommentDTO;
import cz.osu.opr3_final_project.dtos.NewCommentRequestDTO;
import cz.osu.opr3_final_project.dtos.tmdb.TmdbMovieDetailsDTO;
import cz.osu.opr3_final_project.logging.ActivityLogger;
import cz.osu.opr3_final_project.model.entities.Comment;
import cz.osu.opr3_final_project.model.entities.Movie;
import cz.osu.opr3_final_project.model.entities.User;
import cz.osu.opr3_final_project.repositories.CommentRepository;
import cz.osu.opr3_final_project.repositories.MovieRepository;
import cz.osu.opr3_final_project.repositories.UserRepository;
import cz.osu.opr3_final_project.services.MovieService;
import cz.osu.opr3_final_project.services.TmdbService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/comment")
public class CommentController {
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final TmdbService tmdbService;
    private final MovieService movieService;
    private final ActivityLogger activityLogger;

    public CommentController(CommentRepository commentRepository, UserRepository userRepository, MovieRepository movieRepository, TmdbService tmdbService, MovieService movieService, ActivityLogger activityLogger) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
        this.tmdbService = tmdbService;
        this.movieService = movieService;
        this.activityLogger = activityLogger;
    }

    @PutMapping("/{movieId}/comments")
    public ResponseEntity<?> addNewComment(@PathVariable Long movieId, @RequestBody NewCommentRequestDTO newCommentRequestDTO) {
        try {
            User user = userRepository.findById(newCommentRequestDTO.userId()).orElse(null);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
            Movie movie = movieRepository.findById(movieId).orElse(null);

            Comment newComment = new Comment();
            newComment.setContent(newCommentRequestDTO.content());
            newComment.setUser(user);
            newComment.setTimestamp(Instant.now());

            String movieTitle;

            if (movie == null) {
                TmdbMovieDetailsDTO movieDetailsDTO = tmdbService.getMovieDetails(movieId);
                if (movieDetailsDTO == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Movie not found in the TMDB database");
                }
                Movie movieToAdd = movieService.createMovieIfNotExists(movieDetailsDTO);

                newComment.setMovie(movieToAdd);
                commentRepository.save(newComment);

                movieToAdd.getComments().add(newComment);
                movieRepository.save(movieToAdd);

                movieTitle = movieDetailsDTO.title();
            } else {
                newComment.setMovie(movie);
                movie.getComments().add(newComment);
                commentRepository.save(newComment);
                movieRepository.save(movie);

                movieTitle = movie.getTitle();

            }

            user.getComments().add(newComment);
            userRepository.save(user);

            activityLogger.logComment(
                    user.getId(),
                    user.getUsername(),
                    movieId,
                    movieTitle,
                    newCommentRequestDTO.content()
            );

            CommentDTO commentDTO = new CommentDTO(
                    newComment.getId(),
                    newComment.getUser().getUsername(),
                    newComment.getContent(),
                    newComment.getTimestamp().toString(),
                    newComment.getMovie().getTitle(),
                    newComment.getMovie().getId()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(commentDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to add comment: " + e.getMessage());
        }
    }

    @DeleteMapping("/{commentId}/deleteComment")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId, @RequestBody Long userId) {
        try {
            Comment comment = commentRepository.findById(commentId).orElse(null);
            if (comment == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Comment not found");
            }

            if (!comment.getUser().getId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only delete your own comments");
            }

            activityLogger.logCommentDeletion(
                    comment.getUser().getId(),
                    comment.getUser().getUsername(),
                    commentId,
                    comment.getMovie().getTitle()
            );

            commentRepository.delete(comment);
            return ResponseEntity.ok("Comment deleted successfully");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete comment: " + e.getMessage());
        }
    }
}
