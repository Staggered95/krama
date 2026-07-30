package com.krama.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "issue_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IssueHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "issue_id", nullable = false)
    private Issue issue;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String fieldChanged; // e.g., "status", "description"
    private String oldValue;
    private String newValue;

    @Column(updatable = false)
    private LocalDateTime timestamp = LocalDateTime.now();
}