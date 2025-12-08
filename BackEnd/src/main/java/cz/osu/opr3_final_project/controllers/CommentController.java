package cz.osu.opr3_final_project.controllers;

import cz.osu.opr3_final_project.dtos.NewCommentRequestDTO;
import cz.osu.opr3_final_project.dtos.tmdb.TmdbMovieDetailsDTO;
import cz.osu.opr3_final_project.model.entities.Comment;
import cz.osu.opr3_final_project.model.entities.Movie;
import cz.osu.opr3_final_project.model.entities.User;
import cz.osu.opr3_final_project.repositories.CommentRepository;
import cz.osu.opr3_final_project.repositories.MovieRepository;
import cz.osu.opr3_final_project.repositories.UserRepository;
import cz.osu.opr3_final_project.services.MovieService;
import cz.osu.opr3_final_project.services.TmdbService;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/movie")
public class CommentController {
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final TmdbService tmdbService;
    private final MovieService movieService;

    public CommentController(CommentRepository commentRepository, UserRepository userRepository, MovieRepository movieRepository, TmdbService tmdbService, MovieService movieService) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
        this.tmdbService = tmdbService;
        this.movieService = movieService;
    }

    @PutMapping("/{movieId}/comments")
    public boolean addNewComment(@PathVariable Long movieId, @RequestBody NewCommentRequestDTO newCommentRequestDTO) {
        User user = userRepository.findById(newCommentRequestDTO.userId()).orElse(null);
        if (user == null) {
            return false;
        }
        Movie movie = movieRepository.findById(movieId).orElse(null);

        Comment newComment = new Comment();
        newComment.setContent(newCommentRequestDTO.content());
        newComment.setUser(user);
        newComment.setTimestamp( Instant.now());

        if (movie == null) {
            TmdbMovieDetailsDTO movieDetailsDTO = tmdbService.getMovieDetails(movieId);
            if (movieDetailsDTO == null) {
                return false;
            }
            Movie movieToAdd = movieService.createMovieIfNotExists(movieDetailsDTO);

            newComment.setMovie(movieToAdd);
            commentRepository.save(newComment);

            movieToAdd.getComments().add(newComment);
            movieRepository.save(movieToAdd);


        } else {
            newComment.setMovie(movie);
            movie.getComments().add(newComment);

            user.getComments().add(newComment);
            userRepository.save(user);
        }

        user.getComments().add(newComment);
        userRepository.save(user);

        return true;
    }

}
