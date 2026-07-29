package com.krama.backend.service;

import com.krama.backend.dto.ProjectDto;
import com.krama.backend.entity.Project;
import com.krama.backend.repository.ProjectRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectDto createProject(ProjectDto projectDto) {
        Project project = new Project();
        project.setName(projectDto.name());
        project.setDescription(projectDto.description());

        Project savedProject = projectRepository.save(project);
        return mapToDto(savedProject);
    }

    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public void deleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new EntityNotFoundException("Project not found");
        }
        projectRepository.deleteById(id);
    }

    // Helper method to map Entity to DTO
    private ProjectDto mapToDto(Project project) {
        return new ProjectDto(project.getId(), project.getName(), project.getDescription());
    }
}