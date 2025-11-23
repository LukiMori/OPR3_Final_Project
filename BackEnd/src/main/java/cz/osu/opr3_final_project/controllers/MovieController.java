package cz.osu.opr3_final_project.controllers;

import cz.osu.opr3_final_project.dtos.tmdb.TmdbMovieDetailsActorDTO;
import cz.osu.opr3_final_project.dtos.tmdb.TmdbMovieDetailsDTO;
import cz.osu.opr3_final_project.dtos.tmdb.TmdbMovieDetailsDirectorDTO;
import cz.osu.opr3_final_project.model.entities.Genre;
import cz.osu.opr3_final_project.model.entities.Movie;
import cz.osu.opr3_final_project.model.entities.MovieActor;
import cz.osu.opr3_final_project.model.entities.Person;
import cz.osu.opr3_final_project.repositories.GenreRepository;
import cz.osu.opr3_final_project.repositories.MovieActorRepository;
import cz.osu.opr3_final_project.repositories.MovieRepository;
import cz.osu.opr3_final_project.services.TmdbService;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/movie")
public class MovieController {
    private final MovieRepository movieRepository;
    private final TmdbService tmdbService;
    private final MovieActorRepository movieActorRepository;
    private final GenreRepository genreRepository;

    public MovieController(MovieRepository movieRepository, TmdbService tmdbService, MovieActorRepository movieActorRepository, GenreRepository genreRepository) {
        this.movieRepository = movieRepository;
        this.tmdbService = tmdbService;
        this.movieActorRepository = movieActorRepository;
        this.genreRepository = genreRepository;
    }

    @GetMapping("/{ID}")
    public TmdbMovieDetailsDTO getMovieById(@PathVariable Long ID) {
        TmdbMovieDetailsDTO movieDTOToReturn;
        Movie movieToReturn = movieRepository.findById(ID).orElse(null);

        if (movieToReturn == null) {
        movieDTOToReturn = tmdbService.getMovieDetails(ID);
            System.out.println("Movie not found in local database. Fetched from TMDB.");
        } else {
            System.out.println("Movie found in local database.");
            List<MovieActor> movieActors = movieToReturn.getMovieActors();
            List<Person> movieDirectors = movieToReturn.getDirectors();

            List<TmdbMovieDetailsActorDTO> actorDTOs = movieActors.stream()
                    .map(ma -> new TmdbMovieDetailsActorDTO(
                            ma.getPerson().getId(),
                            ma.getPerson().getName(),
                            ma.getCharacterName()
                    ))
                    .collect(Collectors.toList());

            List<TmdbMovieDetailsDirectorDTO> directorDTOs = movieDirectors.stream()
                    .map(director -> new TmdbMovieDetailsDirectorDTO(
                            director.getId(),
                            director.getName()
                    ))
                    .collect(Collectors.toList());

            List<String> genres = movieToReturn.getGenres().stream().map(Genre::getName).collect(Collectors.toList());

            movieDTOToReturn = new TmdbMovieDetailsDTO(
                    movieToReturn.getId(),
                    movieToReturn.getTitle(),
                    movieToReturn.getReleaseDate(),
                    movieToReturn.getDescription(),
                    directorDTOs,
                    actorDTOs,
                    genres,
                    movieToReturn.getVoteTotal(),
                    movieToReturn.getVoteCount(),
                    movieToReturn.getRating(),
                    movieToReturn.getPosterUrl()
            );
        }

        return movieDTOToReturn;
    }
}
