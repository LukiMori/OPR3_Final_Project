package cz.osu.opr3_final_project.repositories;

import cz.osu.opr3_final_project.model.entities.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieRepository extends JpaRepository<Movie, String> {
}
