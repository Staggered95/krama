package com.krama.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    public enum Role { ADMIN, MANAGER, DEVELOPER, TESTER }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @OneToMany(mappedBy = "reporter")
    private List<Issue> reportedIssues;

    @OneToMany(mappedBy = "assignee")
    private List<Issue> assignedIssues;

    @OneToMany(mappedBy = "author")
    private List<Comment> comments;
}