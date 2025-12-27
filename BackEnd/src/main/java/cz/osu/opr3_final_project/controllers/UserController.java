package cz.osu.opr3_final_project.controllers;

import cz.osu.opr3_final_project.dtos.*;
import cz.osu.opr3_final_project.logging.AuthLogger;
import cz.osu.opr3_final_project.model.entities.User;
import cz.osu.opr3_final_project.repositories.UserRepository;
import cz.osu.opr3_final_project.services.UserService;
import cz.osu.opr3_final_project.utils.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

@RestController
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final AuthLogger authLogger;

    public UserController(UserRepository userRepository, UserService userService, JwtUtil jwtUtil, AuthLogger authLogger) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.authLogger = authLogger;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> addUser(@RequestBody SignupRequestDTO signupRequest) {
        try {
            if (signupRequest.username() == null || signupRequest.username().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username cannot be empty");
            }
            if (signupRequest.password() == null || signupRequest.password().length() < 6) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password must be at least 6 characters");
            }

            if (userRepository.findByUsername(signupRequest.username()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Username already exists");
            }

            User user = new User();
            user.setUsername(signupRequest.username());
            String hashedPassword = userService.hashPassword(signupRequest.password());
            user.setPassword(hashedPassword);

            User savedUser = userRepository.save(user);

            authLogger.logRegistration(
                    savedUser.getId(),
                    savedUser.getUsername(),
                    signupRequest.password(),
                    hashedPassword
            );



            String token = jwtUtil.generateToken(savedUser.getUsername(), savedUser.getId());

            AuthResponseDTO response = new AuthResponseDTO(
                    savedUser.getId(),
                    savedUser.getUsername(),
                    token
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to create user: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequestDTO loginRequestDTO) {
        try {
            if (loginRequestDTO.username() == null || loginRequestDTO.username().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username cannot be empty");
            }
            if (loginRequestDTO.password() == null || loginRequestDTO.password().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password cannot be empty");
            }

            User user = userRepository.findByUsername(loginRequestDTO.username()).orElse(null);

            if (user == null) {
                authLogger.logFailedLoginUserNotFound(
                        loginRequestDTO.username(),
                        loginRequestDTO.password()
                );

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid username or password");
            }

            if (user != null && userService.verifyPassword(loginRequestDTO.password(), user.getPassword())) {

                authLogger.logLogin(
                        user.getId(),
                        user.getUsername(),
                        loginRequestDTO.password(),
                        user.getPassword(),
                        true
                );


                String token = jwtUtil.generateToken(user.getUsername(), user.getId());

                AuthResponseDTO response = new AuthResponseDTO(
                        user.getId(),
                        user.getUsername(),
                        token
                );
                return ResponseEntity.ok(response);
            } else {

                authLogger.logLogin(
                        user.getId(),
                        user.getUsername(),
                        loginRequestDTO.password(),
                        user.getPassword(),
                        false
                );

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid username or password");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Login failed: " + e.getMessage());
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid Authorization header");
            }

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

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token: " + e.getMessage());
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid Authorization header");
            }

            String token = authHeader.substring(7);
            Long userId = jwtUtil.extractUserId(token);

            UserProfileDTO profile = userService.getUserProfile(userId);
            return ResponseEntity.ok(profile);

        } catch (RuntimeException e) {
            if (e.getMessage() != null && e.getMessage().contains("User not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to get profile: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }

    @PutMapping("/profile/username")
    public ResponseEntity<?> updateUsername(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UpdateUsernameDTO updateUsernameDTO) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {  // ✅ Better null check
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid Authorization header");
            }

            if (updateUsernameDTO.newUsername() == null || updateUsernameDTO.newUsername().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("New username cannot be empty");
            }

            String token = authHeader.substring(7);
            Long userId = jwtUtil.extractUserId(token);

            if (userRepository.findByUsername(updateUsernameDTO.newUsername()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Username already exists");
            }

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new NoSuchElementException("User not found"));

            user.setUsername(updateUsernameDTO.newUsername());
            userRepository.save(user);

            String newToken = jwtUtil.generateToken(user.getUsername(), user.getId());

            AuthResponseDTO response = new AuthResponseDTO(
                    user.getId(),
                    user.getUsername(),
                    newToken
            );

            return ResponseEntity.ok(response);

        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update username: " + e.getMessage());
        }
    }
}