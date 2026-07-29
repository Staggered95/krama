package com.krama.backend.dto;

public record IssueRequestDto(
        String title,
        String description,
        String type,
        String priority,
        Long projectId,
        Long assigneeId // Optional: can be assigned later
) {}