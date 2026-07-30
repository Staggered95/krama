package com.krama.backend.config;

import com.krama.backend.entity.Issue;
import com.krama.backend.entity.Project;
import com.krama.backend.entity.User;
import com.krama.backend.repository.IssueRepository;
import com.krama.backend.repository.ProjectRepository;
import com.krama.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class DatabaseSeeder {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository,
                                   ProjectRepository projectRepository,
                                   IssueRepository issueRepository) {
        return args -> {
            // Only seed if the database is completely empty
            if (userRepository.count() == 0) {
                System.out.println("====== EMPTY DATABASE DETECTED. SEEDING DUMMY DATA ======");

                PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
                String encodedPassword = passwordEncoder.encode("password123");

                // 1. Create Users (Covering all roles + 1 Clean User)
                User admin = new User(null, "Admin User", "admin@krama.com", encodedPassword, User.Role.ADMIN, null, null, null);
                User manager = new User(null, "Project Manager", "pm@krama.com", encodedPassword, User.Role.MANAGER, null, null, null);
                User dev = new User(null, "Core Developer", "dev@krama.com", encodedPassword, User.Role.DEVELOPER, null, null, null);
                User tester = new User(null, "QA Specialist", "qa@krama.com", encodedPassword, User.Role.TESTER, null, null, null);

                // CLEAN USER: No projects, no issues assigned.
                User cleanUser = new User(null, "Clean Slate", "clean@krama.com", encodedPassword, User.Role.DEVELOPER, null, null, null);

                userRepository.saveAll(List.of(admin, manager, dev, tester, cleanUser));

                // 2. Create Projects
                Project krama = new Project();
                krama.setName("Krama MVP");
                krama.setDescription("Issue tracking system development.");
                krama.getMembers().addAll(List.of(admin, manager, dev, tester)); // Full team

                Project yume = new Project();
                yume.setName("YumeTunes Refactor");
                yume.setDescription("Dockerized audio streaming platform maintenance.");
                yume.getMembers().addAll(List.of(admin, dev)); // Admin & Dev only

                Project nova = new Project();
                nova.setName("Project Nova");
                nova.setDescription("Next-generation analytics dashboard.");
                nova.getMembers().addAll(List.of(manager, tester)); // Manager & Tester only

                projectRepository.saveAll(List.of(krama, yume, nova));

                // 3. Create Issues (Ensuring every active role gets an assignment)

                // Assigned to ADMIN
                Issue issue1 = new Issue(null, "Setup CI/CD Pipeline", "Configure GitHub actions and Docker registry.",
                        Issue.Type.TASK, Issue.Priority.CRITICAL, Issue.Status.IN_PROGRESS, krama, manager, admin, null, null, null);

                // Assigned to MANAGER
                Issue issue2 = new Issue(null, "Sprint Planning & Resource Allocation", "Prepare tasks for the upcoming Sprint 4.",
                        Issue.Type.TASK, Issue.Priority.HIGH, Issue.Status.OPEN, nova, admin, manager, null, null, null);

                // Assigned to DEVELOPER
                Issue issue3 = new Issue(null, "Fix NullPointerException in Audio Buffer", "App crashes when switching songs rapidly.",
                        Issue.Type.BUG, Issue.Priority.HIGH, Issue.Status.OPEN, yume, tester, dev, null, null, null);

                // Assigned to TESTER
                Issue issue4 = new Issue(null, "E2E Testing for Kanban Board", "Verify drag-and-drop state transitions.",
                        Issue.Type.TASK, Issue.Priority.MEDIUM, Issue.Status.OPEN, krama, dev, tester, null, null, null);

                // Unassigned Issue
                Issue issue5 = new Issue(null, "Update README documentation", "Document the new JWT environment variables.",
                        Issue.Type.IMPROVEMENT, Issue.Priority.LOW, Issue.Status.OPEN, krama, admin, null, null, null, null);

                issueRepository.saveAll(List.of(issue1, issue2, issue3, issue4, issue5));

                System.out.println("====== RICH DUMMY DATA SEEDED SUCCESSFULLY ======");
            } else {
                System.out.println("====== EXISTING DATA DETECTED. SKIPPING SEEDER ======");
            }
        };
    }
}