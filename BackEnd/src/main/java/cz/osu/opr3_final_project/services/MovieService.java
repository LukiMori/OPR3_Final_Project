package cz.osu.opr3_final_project.services;

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
import cz.osu.opr3_final_project.repositories.PersonRepository;
import org.springframework.stereotype.Service;

@Service
public class MovieService {

    private final PersonRepository personRepository;
    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;
    private final PersonService personService;
    private final MovieActorRepository movieActorRepository;

    public MovieService(PersonRepository personRepository, MovieRepository movieRepository, GenreRepository genreRepository, PersonService personService, MovieActorRepository movieActorRepository) {
        this.personRepository = personRepository;
        this.movieRepository = movieRepository;
        this.genreRepository = genreRepository;
        this.personService = personService;
        this.movieActorRepository = movieActorRepository;
    }

    public Movie createMovieIfNotExists(TmdbMovieDetailsDTO movieDetailsDTO) {
        Movie newMovie = new Movie();
        newMovie.setId(movieDetailsDTO.id());
        newMovie.setTitle(movieDetailsDTO.title());
        newMovie.setReleaseDate(movieDetailsDTO.releaseDate());
        newMovie.setDescription(movieDetailsDTO.description());
        newMovie.setPosterUrl(movieDetailsDTO.posterUrl());

        for (TmdbMovieDetailsActorDTO actorDTO : movieDetailsDTO.actors()) {

            Person actor = personRepository.findById(actorDTO.id())
                    .orElseGet(() -> personService.createPersonIfNotExists(actorDTO.id()));

            MovieActor movieActor = new MovieActor();
            movieActor.setMovie(newMovie);
            movieActor.setPerson(actor);
            movieActor.setCharacterName(actorDTO.character());

            newMovie.getMovieActors().add(movieActor);
        }
        for (TmdbMovieDetailsDirectorDTO directorDTO : movieDetailsDTO.directors()) {
            Person director = personRepository.findById(directorDTO.id())
                    .orElseGet(() -> personService.createPersonIfNotExists(directorDTO.id()));
            newMovie.getDirectors().add(director);
        }

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
