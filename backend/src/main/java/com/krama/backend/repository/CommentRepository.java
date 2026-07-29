package com.krama.backend.repository;
import com.krama.backend.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    // Fetch the comment thread for a single issue
    List<Comment> findByIssueId(Long issueId);
}