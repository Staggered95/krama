package com.krama.backend.controller;

import com.krama.backend.dto.IssueDto;
import com.krama.backend.dto.IssueRequestDto;
import com.krama.backend.dto.IssueHistoryDto;
import com.krama.backend.service.IssueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class IssueController {

    private final IssueService issueService;

    @PostMapping("/issues")
    public ResponseEntity<IssueDto> createIssue(@RequestBody IssueRequestDto request) {
        IssueDto createdIssue = issueService.createIssue(request);
        return new ResponseEntity<>(createdIssue, HttpStatus.CREATED);
    }

    @GetMapping("/projects/{projectId}/issues")
    public ResponseEntity<List<IssueDto>> getIssuesByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(issueService.getIssuesByProject(projectId));
    }

    @PatchMapping("/issues/{id}/status")
    public ResponseEntity<IssueDto> updateIssueStatus(
            @PathVariable Long id,
            @RequestParam String status,
            Authentication authentication) {
        String userEmail = authentication.getName();
        IssueDto updatedIssue = issueService.updateIssueStatus(id, status, userEmail);
        return ResponseEntity.ok(updatedIssue);
    }

    // ONLY Admins and Managers can hit this endpoint now
    @PatchMapping("/issues/{id}/assign")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<IssueDto> assignIssue(
            @PathVariable Long id,
            @RequestParam Long assigneeId) {
        IssueDto updatedIssue = issueService.assignIssue(id, assigneeId);
        return ResponseEntity.ok(updatedIssue);
    }

    @GetMapping("/issues/{id}/history")
    public ResponseEntity<List<IssueHistoryDto>> getIssueHistory(@PathVariable Long id) {
        return ResponseEntity.ok(issueService.getIssueHistory(id));
    }

    // NEW: Fetch assigned issues for the logged-in user
    @GetMapping("/issues/me")
    public ResponseEntity<List<IssueDto>> getMyIssues(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(issueService.getIssuesAssignedToUser(email));
    }
}