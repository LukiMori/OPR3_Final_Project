package cz.osu.opr3_final_project.controllers;

import cz.osu.opr3_final_project.dtos.CommentDTO;
import cz.osu.opr3_final_project.dtos.tmdb.TmdbMovieDetailsDTO;
import cz.osu.opr3_final_project.model.entities.*;
import cz.osu.opr3_final_project.repositories.*;
import cz.osu.opr3_final_project.services.MovieService;
import cz.osu.opr3_final_project.services.TmdbService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/movie")
public class MovieController {
    private final MovieRepository movieRepository;
    private final TmdbService tmdbService;
    private final MovieService movieService;
    private final UserRepository userRepository;

    public MovieController(MovieRepository movieRepository, TmdbService tmdbService, MovieService movieService, UserRepository userRepository) {
        this.movieRepository = movieRepository;
        this.tmdbService = tmdbService;
        this.movieService = movieService;
        this.userRepository = userRepository;
    }

    @GetMapping("/{ID}")
    public ResponseEntity<?> getMovieById(@PathVariable Long ID) {
        try {
            TmdbMovieDetailsDTO movieDTOToReturn;
            Movie movieToReturn = movieRepository.findById(ID).orElse(null);

            if (movieToReturn == null) {
                movieDTOToReturn = tmdbService.getMovieDetails(ID);
                if (movieDTOToReturn == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Movie not found");
                }
            } else {
                List<String> genres = movieToReturn.getGenres() != null
                        ? movieToReturn.getGenres().stream().map(Genre::getName).collect(Collectors.toList())
                        : new ArrayList<>();

                List<CommentDTO> comments = movieToReturn.getComments() != null
                        ? movieToReturn.getComments().stream()
                        .map(comment -> new CommentDTO(
                                comment.getId(),
                                comment.getUser().getUsername(),
                                comment.getContent(),
                                comment.getTimestamp().toString(),
                                comment.getMovie().getTitle(),
                                comment.getMovie().getId()
                        )).toList()
                        : new ArrayList<>();

                movieDTOToReturn = new TmdbMovieDetailsDTO(
                        movieToReturn.getId(),
                        movieToReturn.getTitle(),
                        movieToReturn.getReleaseDate(),
                        movieToReturn.getDescription(),
                        genres,
                        comments,
                        movieToReturn.getPosterUrl()
                );
            }

            return ResponseEntity.ok(movieDTOToReturn);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to get movie: " + e.getMessage());
        }
    }


    @GetMapping("/{movieId}/isLiked")
    public ResponseEntity<?> isMovieLikedByUser(@PathVariable Long movieId, @RequestParam Long userId) {
        try {
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            List<Movie> movies = user.getFavouriteMovies();
            if (movies == null) {
                return ResponseEntity.ok(false);
            }

            for (Movie movie : movies) {
                if (movie.getId().equals(movieId)) {
                    return ResponseEntity.ok(true);
                }
            }
            return ResponseEntity.ok(false);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to check if movie is liked: " + e.getMessage());
        }
    }

    @PutMapping("/{movieId}/changeLikedStatus")
    public ResponseEntity<?> changeMovieLikedStatusByUser(
            @PathVariable Long movieId,
            @RequestParam Long userId,
            @RequestParam boolean currentMovieLikedStatus) {
        try {
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            Movie movie = movieRepository.findById(movieId).orElse(null);

            if (movie == null) {
                TmdbMovieDetailsDTO movieDetailsDTO = tmdbService.getMovieDetails(movieId);
                if (movieDetailsDTO == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Movie not found");
                }
                Movie movieToAdd = movieService.createMovieIfNotExists(movieDetailsDTO);
                user.getFavouriteMovies().add(movieToAdd);
                userRepository.save(user);
            } else {
                if (currentMovieLikedStatus) {
                    user.getFavouriteMovies().add(movie);
                    userRepository.save(user);
                } else {
                    user.getFavouriteMovies().remove(movie);
                    userRepository.save(user);
                }
            }

            return ResponseEntity.ok("Liked status changed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to change liked status: " + e.getMessage());
        }
    }

}
