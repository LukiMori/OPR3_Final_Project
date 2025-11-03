package cz.osu.opr3_final_project.controllers;

import cz.osu.opr3_final_project.dtos.tmdb.TmdbMovieSearchDTO;
import cz.osu.opr3_final_project.dtos.tmdb.TmdbPersonSearchDTO;
import cz.osu.opr3_final_project.dtos.tmdb.TmdbSearchResultsDTO;
import cz.osu.opr3_final_project.services.TmdbService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final TmdbService tmdbService;

    public SearchController(TmdbService tmdbService) {
        this.tmdbService = tmdbService;
    }

    @GetMapping("/movies")
    public ResponseEntity<TmdbSearchResultsDTO<TmdbMovieSearchDTO>> searchMovies(
            @RequestParam(required = false, defaultValue = "") String query,
            @RequestParam(required = false, defaultValue = "1") int page) {

        TmdbSearchResultsDTO<TmdbMovieSearchDTO> results = tmdbService.searchMovies(query, page);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/people")
    public ResponseEntity<TmdbSearchResultsDTO<TmdbPersonSearchDTO>> searchPeople(
            @RequestParam(required = false, defaultValue = "") String query,
            @RequestParam(required = false, defaultValue = "1") int page) {

        TmdbSearchResultsDTO<TmdbPersonSearchDTO> results = tmdbService.searchPeople(query, page);
        return ResponseEntity.ok(results);
    }
}