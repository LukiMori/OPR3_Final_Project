package cz.osu.opr3_final_project.services;

import cz.osu.opr3_final_project.dtos.tmdb.TmdbMovieDetailsDTO;
import cz.osu.opr3_final_project.model.entities.Genre;
import cz.osu.opr3_final_project.model.entities.Movie;
import cz.osu.opr3_final_project.repositories.GenreRepository;
import cz.osu.opr3_final_project.repositories.MovieRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class MovieService {

    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;

    public MovieService(MovieRepository movieRepository, GenreRepository genreRepository) {
        this.movieRepository = movieRepository;
        this.genreRepository = genreRepository;
    }

    public Movie createMovieIfNotExists(TmdbMovieDetailsDTO movieDetailsDTO) {
        if (movieDetailsDTO == null) {
            throw new IllegalArgumentException("Movie details cannot be null");
        }

        Movie newMovie = new Movie();
        newMovie.setId(movieDetailsDTO.id());
        newMovie.setTitle(movieDetailsDTO.title());
        newMovie.setReleaseDate(movieDetailsDTO.releaseDate());
        newMovie.setDescription(movieDetailsDTO.description());
        newMovie.setPosterUrl(movieDetailsDTO.posterUrl());

        if (newMovie.getGenres() == null) {
            newMovie.setGenres(new ArrayList<>());
        }

        if (movieDetailsDTO.genre() != null) {
            for (String genreName : movieDetailsDTO.genre()) {
                if (genreName != null && !genreName.trim().isEmpty()) {
                    Genre genreEntity = genreRepository.findByName(genreName)
                            .orElseGet(() -> {
                                Genre newGenre = new Genre();
                                newGenre.setName(genreName);
                                return genreRepository.save(newGenre);
                            });
                    newMovie.getGenres().add(genreEntity);
                }
            }
        }

        movieRepository.save(newMovie);
        return newMovie;
    }
}