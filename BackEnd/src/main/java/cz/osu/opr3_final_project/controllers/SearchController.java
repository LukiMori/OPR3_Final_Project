package cz.osu.opr3_final_project.controllers;

import cz.osu.opr3_final_project.dtos.tmdb.TmdbMovieSearchDTO;
import cz.osu.opr3_final_project.dtos.tmdb.TmdbSearchResultsDTO;
import cz.osu.opr3_final_project.services.TmdbService;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<?> searchMovies(
            @RequestParam(required = false, defaultValue = "") String query) {

        try {
            TmdbSearchResultsDTO<TmdbMovieSearchDTO> results = tmdbService.searchMovies(query);

            if (results == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Failed to retrieve search results");
            }

            return ResponseEntity.ok(results);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Search failed: " + e.getMessage());
        }
    }
}