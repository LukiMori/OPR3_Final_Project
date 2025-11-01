package cz.osu.opr3_final_project.controllers;

import cz.osu.opr3_final_project.dtos.LoginRequestDTO;
import cz.osu.opr3_final_project.model.entities.User;
import cz.osu.opr3_final_project.repositories.UserRepository;
import cz.osu.opr3_final_project.services.UserService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;

    public UserController(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @PostMapping("/signup")
    public User addUser(@RequestBody User user) {
        user.setPassword(userService.hashPassword(user.getPassword()));
        return userRepository.save(user);
    }

    @PostMapping("/login")
    public User loginUser(@RequestBody LoginRequestDTO loginRequestDTO) {
        User user = userRepository.findByUsername(loginRequestDTO.username()).orElse(null);
        if (user != null && userService.verifyPassword(loginRequestDTO.password(), user.getPassword())) {
            return user;
        } else {
            return null;
        }
    }

}
