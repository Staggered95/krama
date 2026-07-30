package com.krama.backend.dto;

import java.time.LocalDateTime;

public record IssueHistoryDto(
        Long id,
        String userName,
        String fieldChanged,
        String oldValue,
        String newValue,
        LocalDateTime timestamp
) {}