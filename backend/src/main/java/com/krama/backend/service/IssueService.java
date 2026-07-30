package com.krama.backend.service;

import com.krama.backend.dto.IssueDto;
import com.krama.backend.dto.IssueRequestDto;
import com.krama.backend.dto.IssueHistoryDto;
import com.krama.backend.entity.Issue;
import com.krama.backend.entity.IssueHistory;
import com.krama.backend.entity.Project;
import com.krama.backend.entity.User;
import com.krama.backend.repository.IssueRepository;
import com.krama.backend.repository.IssueHistoryRepository;
import com.krama.backend.repository.ProjectRepository;
import com.krama.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IssueService {

    private final IssueRepository issueRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final IssueHistoryRepository issueHistoryRepository; // Inject the new repo

    public IssueDto createIssue(IssueRequestDto request) {
        Project project = projectRepository.findById(request.projectId())
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));

        // FIX: Dynamically get the first user instead of hardcoding ID 1L
        User reporter = userRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new EntityNotFoundException("No users exist in the database to act as reporter"));

        Issue issue = new Issue();
        issue.setTitle(request.title());
        issue.setDescription(request.description());
        issue.setType(Issue.Type.valueOf(request.type().toUpperCase()));
        issue.setPriority(Issue.Priority.valueOf(request.priority().toUpperCase()));
        issue.setStatus(Issue.Status.OPEN); // Always starts as OPEN
        issue.setProject(project);
        issue.setReporter(reporter);

        if (request.assigneeId() != null) {
            User assignee = userRepository.findById(request.assigneeId())
                    .orElseThrow(() -> new EntityNotFoundException("Assignee not found"));
            issue.setAssignee(assignee);
        }

        Issue savedIssue = issueRepository.save(issue);
        return mapToDto(savedIssue);
    }

    public List<IssueDto> getIssuesByProject(Long projectId) {
        return issueRepository.findByProjectId(projectId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // UPDATED: Now requires userEmail to record the audit trail
    public IssueDto updateIssueStatus(Long issueId, String newStatus, String userEmail) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new EntityNotFoundException("Issue not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Issue.Status oldStatus = issue.getStatus();
        Issue.Status targetStatus = Issue.Status.valueOf(newStatus.toUpperCase());

        // Only log to history if the status actually changed
        if (oldStatus != targetStatus) {
            issue.setStatus(targetStatus);
            issue = issueRepository.save(issue);

            // Create and save the history record
            IssueHistory history = new IssueHistory();
            history.setIssue(issue);
            history.setUser(user);
            history.setFieldChanged("status");
            history.setOldValue(oldStatus.name());
            history.setNewValue(targetStatus.name());

            issueHistoryRepository.save(history);
        }

        return mapToDto(issue);
    }

    public IssueDto assignIssue(Long issueId, Long assigneeId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new EntityNotFoundException("Issue not found"));

        User assignee = userRepository.findById(assigneeId)
                .orElseThrow(() -> new EntityNotFoundException("Assignee not found"));

        issue.setAssignee(assignee);

        // Business Rule: Automatically move to ASSIGNED if currently OPEN
        if (issue.getStatus() == Issue.Status.OPEN) {
            issue.setStatus(Issue.Status.IN_PROGRESS);
        }

        return mapToDto(issueRepository.save(issue));
    }

    // NEW: Fetch history for the controller
    public List<IssueHistoryDto> getIssueHistory(Long issueId) {
        return issueHistoryRepository.findByIssueIdOrderByTimestampDesc(issueId)
                .stream()
                .map((IssueHistory h) -> new IssueHistoryDto( // <-- Explicitly added IssueHistory here
                        h.getId(),
                        h.getUser().getName(),
                        h.getFieldChanged(),
                        h.getOldValue(),
                        h.getNewValue(),
                        h.getTimestamp()
                ))
                .collect(Collectors.toList());
    }

    // Helper method to map Entity to DTO
    private IssueDto mapToDto(Issue issue) {
        return new IssueDto(
                issue.getId(),
                issue.getTitle(),
                issue.getDescription(),
                issue.getType().name(),
                issue.getPriority().name(),
                issue.getStatus().name(),
                issue.getProject().getId(),
                issue.getProject().getName(),
                issue.getReporter().getId(),
                issue.getReporter().getName(),
                issue.getAssignee() != null ? issue.getAssignee().getId() : null,
                issue.getAssignee() != null ? issue.getAssignee().getName() : null,
                issue.getCreatedAt(),
                issue.getUpdatedAt()
        );
    }

    // NEW: Get all issues assigned to a user email
    public List<IssueDto> getIssuesAssignedToUser(String email) {
        return issueRepository.findByAssigneeEmail(email)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
}