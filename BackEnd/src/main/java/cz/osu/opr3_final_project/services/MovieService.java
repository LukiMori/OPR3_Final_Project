package cz.osu.opr3_final_project.services;

import cz.osu.opr3_final_project.dtos.tmdb.TmdbMovieDetailsDTO;
import cz.osu.opr3_final_project.model.entities.Genre;
import cz.osu.opr3_final_project.model.entities.Movie;
import cz.osu.opr3_final_project.repositories.GenreRepository;
import cz.osu.opr3_final_project.repositories.MovieRepository;
import org.springframework.stereotype.Service;

@Service
public class MovieService {

    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;

    public MovieService(MovieRepository movieRepository, GenreRepository genreRepository) {
        this.movieRepository = movieRepository;
        this.genreRepository = genreRepository;
    }

    public Movie createMovieIfNotExists(TmdbMovieDetailsDTO movieDetailsDTO) {
        Movie newMovie = new Movie();
        newMovie.setId(movieDetailsDTO.id());
        newMovie.setTitle(movieDetailsDTO.title());
        newMovie.setReleaseDate(movieDetailsDTO.releaseDate());
        newMovie.setDescription(movieDetailsDTO.description());
        newMovie.setPosterUrl(movieDetailsDTO.posterUrl());

        for (String genre : movieDetailsDTO.genre()) {
            Genre genreEntity = genreRepository.findByName(genre)
                    .orElseGet(() -> {
                        Genre newGenre = new Genre();
                        newGenre.setName(genre);
                        return genreRepository.save(newGenre);
                    });
            newMovie.getGenres().add(genreEntity);
        }

        movieRepository.save(newMovie);
        return newMovie;
    }
}
