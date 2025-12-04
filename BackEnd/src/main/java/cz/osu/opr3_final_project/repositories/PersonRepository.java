package cz.osu.opr3_final_project.repositories;

import cz.osu.opr3_final_project.model.entities.Person;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PersonRepository extends JpaRepository<Person, Long> {
    Optional<Person> findById(Person PersonId);
}
