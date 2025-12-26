package cz.osu.opr3_final_project.controllers;

import cz.osu.opr3_final_project.dtos.CommentDTO;
import cz.osu.opr3_final_project.dtos.tmdb.TmdbMovieDetailsActorDTO;
import cz.osu.opr3_final_project.dtos.tmdb.TmdbMovieDetailsDTO;
import cz.osu.opr3_final_project.dtos.tmdb.TmdbMovieDetailsDirectorDTO;
import cz.osu.opr3_final_project.model.entities.*;
import cz.osu.opr3_final_project.repositories.*;
import cz.osu.opr3_final_project.services.MovieService;
import cz.osu.opr3_final_project.services.TmdbService;
import org.springframework.web.bind.annotation.*;

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
    public TmdbMovieDetailsDTO getMovieById(@PathVariable Long ID) {
        TmdbMovieDetailsDTO movieDTOToReturn;
        Movie movieToReturn = movieRepository.findById(ID).orElse(null);

        if (movieToReturn == null) {
            movieDTOToReturn = tmdbService.getMovieDetails(ID);
        } else {
            List<String> genres = movieToReturn.getGenres().stream().map(Genre::getName).collect(Collectors.toList());

            List<CommentDTO> comments = movieToReturn.getComments().stream().map(comment -> new CommentDTO(comment.getId(), comment.getUser().getUsername(), comment.getContent(), comment.getTimestamp().toString(), comment.getMovie().getTitle(), comment.getMovie().getId())).toList();

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

        return movieDTOToReturn;
    }


    @GetMapping("/{movieId}/isLiked")
    public boolean isMovieLikedByUser(@PathVariable Long movieId, @RequestParam Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return false;
        }
        List<Movie> movies = user.getFavouriteMovies();
        for (Movie movie : movies) {
            if (movie.getId().equals(movieId)) {
                return true;
            }
        }
        return false;
    }

    @PutMapping("/{movieId}/changeLikedStatus")
    public boolean changeMovieLikedStatusByUser(@PathVariable Long movieId, @RequestParam Long userId, @RequestParam boolean currentMovieLikedStatus) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return false;
        }

        Movie movie = movieRepository.findById(movieId).orElse(null);

        if (movie == null) {
            TmdbMovieDetailsDTO movieDetailsDTO = tmdbService.getMovieDetails(movieId);
            if (movieDetailsDTO == null) {
                return false;
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

        return true;
    }
}
