package com.krama.backend.service;

import com.krama.backend.dto.IssueDto;
import com.krama.backend.dto.IssueRequestDto;
import com.krama.backend.entity.Issue;
import com.krama.backend.entity.Project;
import com.krama.backend.entity.User;
import com.krama.backend.repository.IssueRepository;
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

    // Hardcoding a reporter ID for now until Spring Security (JWT) is implemented
    private final Long CURRENT_USER_ID = 1L;

    public IssueDto createIssue(IssueRequestDto request) {
        Project project = projectRepository.findById(request.projectId())
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));

        User reporter = userRepository.findById(CURRENT_USER_ID)
                .orElseThrow(() -> new EntityNotFoundException("Reporter not found"));

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

    public IssueDto updateIssueStatus(Long issueId, String newStatus) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new EntityNotFoundException("Issue not found"));

        // This automatically throws IllegalArgumentException if the status string is invalid
        issue.setStatus(Issue.Status.valueOf(newStatus.toUpperCase()));

        return mapToDto(issueRepository.save(issue));
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
}