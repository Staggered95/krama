package com.krama.backend.config;

import com.krama.backend.entity.Project;
import com.krama.backend.entity.User;
import com.krama.backend.repository.ProjectRepository;
import com.krama.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DatabaseSeeder {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, ProjectRepository projectRepository) {
        return args -> {
            // Only insert if the database is completely empty
            if (userRepository.count() == 0) {
                User user = new User();
                user.setName("Admin User");
                user.setEmail("admin@krama.com");
                user.setPassword("password123"); // We will hash this when we add JWT later
                user.setRole(User.Role.ADMIN);
                userRepository.save(user);

                Project project = new Project();
                project.setName("Krama MVP Integration");
                project.setDescription("Board for tracking the development of Krama.");
                projectRepository.save(project);

                System.out.println("====== DUMMY DATA SEEDED ======");
            }
        };
    }
}