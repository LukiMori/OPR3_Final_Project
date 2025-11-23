package cz.osu.opr3_final_project.repositories;

import cz.osu.opr3_final_project.model.entities.MovieActor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MovieActorRepository extends JpaRepository<MovieActor, Long> {
    Optional<MovieActor> findByMovieIdAndPersonId(Long movieId, Long personId);

}
