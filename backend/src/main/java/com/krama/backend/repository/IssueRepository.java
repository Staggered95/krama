package com.krama.backend.repository;

import com.krama.backend.entity.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
    // Fetch all issues for a specific project board
    List<Issue> findByProjectId(Long projectId);

    // Fetch all issues assigned to a specific developer
    List<Issue> findByAssigneeId(Long assigneeId);

    // Fetch all issues reported by a specific user
    List<Issue> findByReporterId(Long reporterId);
}