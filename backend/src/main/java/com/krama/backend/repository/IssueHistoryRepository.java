package com.krama.backend.repository;

import com.krama.backend.entity.IssueHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

// Make sure <IssueHistory, Long> is actually in your file!
public interface IssueHistoryRepository extends JpaRepository<IssueHistory, Long> {

    // Make sure <IssueHistory> is actually in your file!
    List<IssueHistory> findByIssueIdOrderByTimestampDesc(Long issueId);
}