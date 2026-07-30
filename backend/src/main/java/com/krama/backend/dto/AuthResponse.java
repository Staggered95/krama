package com.krama.backend.dto;

public record AuthResponse(
        String token,
        Long userId,
        String name,
        String role
) {}