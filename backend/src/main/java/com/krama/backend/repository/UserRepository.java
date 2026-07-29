package com.krama.backend.repository;

import com.krama.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Spring parses "findByEmail" and creates: SELECT * FROM users WHERE email = ?
    Optional<User> findByEmail(String email);
}