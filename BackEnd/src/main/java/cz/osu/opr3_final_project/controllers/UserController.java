package cz.osu.opr3_final_project.controllers;

import cz.osu.opr3_final_project.dtos.*;
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
        if (userRepository.findByUsername(signupRequest.username()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Username already exists");
        }
        System.out.println(signupRequest.getClass());
        User user = new User();
        user.setUsername(signupRequest.username());
        user.setPassword(userService.hashPassword(signupRequest.password()));

        User savedUser = userRepository.save(user);
        String token = jwtUtil.generateToken(savedUser.getUsername(), savedUser.getId());

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
            String token = jwtUtil.generateToken(user.getUsername(), user.getId());

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

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                Long userId = jwtUtil.extractUserId(token);

                UserProfileDTO profile = userService.getUserProfile(userId);
                return ResponseEntity.ok(profile);
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }

    @PutMapping("/profile/username")
    public ResponseEntity<?> updateUsername(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UpdateUsernameDTO updateUsernameDTO) {
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                Long userId = jwtUtil.extractUserId(token);

                if (userRepository.findByUsername(updateUsernameDTO.newUsername()).isPresent()) {
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body("Username already exists");
                }

                User user = userRepository.findById(userId).orElseThrow();
                user.setUsername(updateUsernameDTO.newUsername());
                userRepository.save(user);

                String newToken = jwtUtil.generateToken(user.getUsername(), user.getId());

                AuthResponseDTO response = new AuthResponseDTO(
                        user.getId(),
                        user.getUsername(),
                        newToken
                );

                return ResponseEntity.ok(response);
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to update username");
        }
    }
}