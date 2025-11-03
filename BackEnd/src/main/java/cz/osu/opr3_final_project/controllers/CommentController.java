package cz.osu.opr3_final_project.controllers;

import cz.osu.opr3_final_project.repositories.CommentRepository;
import cz.osu.opr3_final_project.repositories.MovieRepository;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CommentController {
    private final CommentRepository commentRepository;

    public CommentController(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }


}
