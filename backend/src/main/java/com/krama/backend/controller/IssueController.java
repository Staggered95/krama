package com.krama.backend.controller;

import com.krama.backend.dto.IssueDto;
import com.krama.backend.dto.IssueRequestDto;
import com.krama.backend.service.IssueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class IssueController {

    private final IssueService issueService;

    // Create a new issue
    @PostMapping("/issues")
    public ResponseEntity<IssueDto> createIssue(@RequestBody IssueRequestDto request) {
        IssueDto createdIssue = issueService.createIssue(request);
        return new ResponseEntity<>(createdIssue, HttpStatus.CREATED);
    }

    // Get all issues for a specific project board
    @GetMapping("/projects/{projectId}/issues")
    public ResponseEntity<List<IssueDto>> getIssuesByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(issueService.getIssuesByProject(projectId));
    }

    // Update issue status (e.g., moving across the Kanban board)
    @PatchMapping("/issues/{id}/status")
    public ResponseEntity<IssueDto> updateIssueStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        IssueDto updatedIssue = issueService.updateIssueStatus(id, status);
        return ResponseEntity.ok(updatedIssue);
    }

    // Assign an issue to a user
    @PatchMapping("/issues/{id}/assign")
    public ResponseEntity<IssueDto> assignIssue(
            @PathVariable Long id,
            @RequestParam Long assigneeId) {
        IssueDto updatedIssue = issueService.assignIssue(id, assigneeId);
        return ResponseEntity.ok(updatedIssue);
    }
}