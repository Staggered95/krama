package com.krama.backend.controller;

import com.krama.backend.entity.Project;
import com.krama.backend.entity.User;
import com.krama.backend.repository.ProjectRepository;
import com.krama.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    // 1. DTOs to completely isolate Database Entities from JSON Serialization
    public record ProjectDto(Long id, String name, String description) {}
    public record ProjectMemberDto(Long id, String name, String email, String role) {}

    @GetMapping
    public ResponseEntity<List<ProjectDto>> getAllProjects(Authentication authentication) {
        String email = authentication.getName();

        // Bulletproof check: Look for the word ADMIN or MANAGER anywhere in the authority string
        boolean canSeeAll = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().contains("ADMIN") || auth.getAuthority().contains("MANAGER"));

        List<Project> projects;
        if (canSeeAll) {
            projects = projectRepository.findAll();
        } else {
            projects = projectRepository.findByMembers_Email(email);
        }

        // Map safe Data Transfer Objects back to the frontend
        List<ProjectDto> projectDtos = projects.stream()
                .map(p -> new ProjectDto(p.getId(), p.getName(), p.getDescription()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(projectDtos);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ProjectDto> createProject(@RequestBody ProjectDto request, Authentication authentication) {
        String email = authentication.getName();

        User creator = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Explicitly create a NEW entity so Hibernate tracks it perfectly from birth
        Project newProject = new Project();
        newProject.setName(request.name());
        newProject.setDescription(request.description());

        // 3. Initialize the collection and attach the creator
        Set<User> members = new HashSet<>();
        members.add(creator);
        newProject.setMembers(members);

        Project savedProject = projectRepository.save(newProject);

        return ResponseEntity.ok(new ProjectDto(
                savedProject.getId(),
                savedProject.getName(),
                savedProject.getDescription()
        ));
    }

    @PostMapping("/{projectId}/members")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<?> addMemberToProject(@PathVariable Long projectId, @RequestBody Map<String, String> payload) {
        String email = payload.get("email");

        User newMember = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        project.getMembers().add(newMember);
        projectRepository.save(project);

        return ResponseEntity.ok(Map.of("message", "Member added successfully", "user", newMember.getName()));
    }

    @GetMapping("/{projectId}/members")
    public ResponseEntity<List<ProjectMemberDto>> getProjectMembers(@PathVariable Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        List<ProjectMemberDto> members = project.getMembers().stream()
                .map(u -> new ProjectMemberDto(u.getId(), u.getName(), u.getEmail(), u.getRole().name()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(members);
    }
}