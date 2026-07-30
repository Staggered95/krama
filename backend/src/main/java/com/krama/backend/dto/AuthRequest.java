package com.krama.backend.dto;

public record AuthRequest(
        String email,
        String password
) {}