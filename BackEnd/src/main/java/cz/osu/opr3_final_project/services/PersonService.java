package cz.osu.opr3_final_project.services;

import cz.osu.opr3_final_project.dtos.tmdb.TmdbMovieDetailsActorDTO;
import cz.osu.opr3_final_project.dtos.tmdb.TmdbMovieDetailsDirectorDTO;
import cz.osu.opr3_final_project.dtos.tmdb.TmdbPersonDetailsDTO;
import cz.osu.opr3_final_project.model.entities.Person;
import cz.osu.opr3_final_project.repositories.PersonRepository;
import org.springframework.stereotype.Service;

@Service
public class PersonService {

    private final PersonRepository personRepository;
    private final TmdbService tmdbService;

    public PersonService(PersonRepository personRepository, TmdbService tmdbService) {
        this.personRepository = personRepository;
        this.tmdbService = tmdbService;
    }

    public Person createPersonIfNotExists(Long personId) {
        TmdbPersonDetailsDTO newPerson = tmdbService.getPersonDetails(personId);
        Person person = new Person();
        person.setId(newPerson.id());
        person.setName(newPerson.name());
        person.setBiography(newPerson.biography());
        person.setBirthDate(newPerson.birthday());

        return personRepository.save(person);
    }


}
