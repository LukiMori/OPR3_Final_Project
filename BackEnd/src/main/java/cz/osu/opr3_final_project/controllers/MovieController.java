package cz.osu.opr3_final_project.controllers;

import cz.osu.opr3_final_project.model.entities.Movie;
import cz.osu.opr3_final_project.repositories.MovieRepository;
import org.springframework.web.bind.annotation.*;


@RestController
public class MovieController {
    private final MovieRepository movieRepository;

    public MovieController(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @GetMapping("/movie/{ID}")
    public Movie getMovieById(@PathVariable Long ID) {
        return movieRepository.findById(ID).orElse(null);
    }
}
