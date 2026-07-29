package com.krama.backend.dto;

import java.time.LocalDateTime;

public record IssueDto(
        Long id,
        String title,
        String description,
        String type,
        String priority,
        String status,
        Long projectId,
        String projectName,
        Long reporterId,
        String reporterName,
        Long assigneeId,
        String assigneeName,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}