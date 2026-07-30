package com.krama.backend.controller;

import com.krama.backend.entity.User;
import com.krama.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')") // ENTIRE controller locked to Admins
public class UserController {

    private final UserRepository userRepository;

    // Inner DTO so we don't leak hashed passwords to the frontend
    public record UserDto(Long id, String name, String email, String role) {
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userRepository.findAll().stream()
                .map(u -> new UserDto(u.getId(), u.getName(), u.getEmail(), u.getRole().name()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<?> updateRole(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            user.setRole(User.Role.valueOf(payload.get("role").toUpperCase()));
            userRepository.save(user);
            return ResponseEntity.ok("Role updated successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid role");
        }
    }
}