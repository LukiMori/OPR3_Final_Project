package cz.osu.opr3_final_project.controllers;

import cz.osu.opr3_final_project.model.entities.Movie;
import cz.osu.opr3_final_project.repositories.MovieRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class MovieController {
    private final MovieRepository movieRepository;

    public MovieController(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @GetMapping("/movies")
    public List<Movie> getMovies() {
        return movieRepository.findAll();
    }

    @GetMapping("/movies/{ID}")
    public Movie getMovieById(@PathVariable String ID) {
        return movieRepository.findById(ID).orElse(null);
    }

    @PostMapping
    public Movie addMovie(@RequestBody Movie movie) {
        return movieRepository.save(movie);
    }
}
