package cz.osu.opr3_final_project.repositories;

import cz.osu.opr3_final_project.model.entities.Comment;
import cz.osu.opr3_final_project.model.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    Optional<Comment> findByUser(User UserID);

}
