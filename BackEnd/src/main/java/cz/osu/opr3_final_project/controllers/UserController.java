package cz.osu.opr3_final_project.controllers;

import cz.osu.opr3_final_project.dtos.AuthResponseDTO;
import cz.osu.opr3_final_project.dtos.MovieRequestDTO;
import cz.osu.opr3_final_project.dtos.LoginRequestDTO;
import cz.osu.opr3_final_project.dtos.SignupRequestDTO;
import cz.osu.opr3_final_project.model.entities.User;
import cz.osu.opr3_final_project.repositories.UserRepository;
import cz.osu.opr3_final_project.services.UserService;
import cz.osu.opr3_final_project.utils.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public UserController(UserRepository userRepository, UserService userService, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> addUser(@RequestBody SignupRequestDTO signupRequest) {
        // Check if username already exists
        if (userRepository.findByUsername(signupRequest.username()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Username already exists");
        }

        // Create new user
        User user = new User();
        user.setUsername(signupRequest.username());
        user.setPassword(userService.hashPassword(signupRequest.password()));

        User savedUser = userRepository.save(user);

        // Generate JWT token
        String token = jwtUtil.generateToken(savedUser.getUsername(), savedUser.getId());

        // Return user with token
        AuthResponseDTO response = new AuthResponseDTO(
                savedUser.getId(),
                savedUser.getUsername(),
                token
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequestDTO loginRequestDTO) {
        User user = userRepository.findByUsername(loginRequestDTO.username()).orElse(null);

        if (user != null && userService.verifyPassword(loginRequestDTO.password(), user.getPassword())) {
            // Generate JWT token
            String token = jwtUtil.generateToken(user.getUsername(), user.getId());

            // Return user with token
            AuthResponseDTO response = new AuthResponseDTO(
                    user.getId(),
                    user.getUsername(),
                    token
            );
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username or password");
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                String username = jwtUtil.extractUsername(token);
                Long userId = jwtUtil.extractUserId(token);

                User user = userRepository.findByUsername(username).orElse(null);

                if (user != null && jwtUtil.validateToken(token, username)) {
                    AuthResponseDTO response = new AuthResponseDTO(
                            userId,
                            username,
                            token
                    );
                    return ResponseEntity.ok(response);
                }
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }
}