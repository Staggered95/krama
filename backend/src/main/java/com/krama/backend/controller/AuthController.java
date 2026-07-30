package com.krama.backend.controller;

import com.krama.backend.dto.AuthRequest;
import com.krama.backend.dto.AuthResponse;
import com.krama.backend.dto.RegisterRequest;
import com.krama.backend.entity.User;
import com.krama.backend.repository.UserRepository;
import com.krama.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElse(null);

        // Verify user exists and password matches the hashed version in DB
        if (user == null || !passwordEncoder.matches(request.password(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        // Generate the token
        String token = jwtUtil.generateToken(user);

        // Return the payload React needs to establish context
        return ResponseEntity.ok(new AuthResponse(token, user.getId(), user.getName(), user.getRole().name()));
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody RegisterRequest request) {
        // 1. Check if email is already taken
        if (userRepository.findByEmail(request.email()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email is already registered");
        }

        // 2. Create the user
        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password())); // Hash it!
        user.setRole(User.Role.DEVELOPER); // Default role for newcomers

        userRepository.save(user);

        // 3. Generate token and return so the frontend logs them in instantly
        String token = jwtUtil.generateToken(user);
        return ResponseEntity.ok(new AuthResponse(token, user.getId(), user.getName(), user.getRole().name()));
    }
}