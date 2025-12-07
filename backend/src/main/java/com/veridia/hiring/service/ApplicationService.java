package com.veridia.hiring.service;

import com.veridia.hiring.model.Application;
import com.veridia.hiring.model.ApplicationStatus;
import com.veridia.hiring.model.User;
import com.veridia.hiring.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    private final String UPLOAD_DIR = "uploads/resumes/";

    public Application submitApplication(User candidate, String firstName, String lastName, String phone, 
                                       String location, String linkedinProfile, String githubProfile, 
                                       String portfolioLink, String skills, String education, String experience,
                                       String availability, String expectedSalary, String noticePeriod, 
                                       String workMode, MultipartFile resume) {
        
        // Check if candidate already has an application
        Optional<Application> existingApp = applicationRepository.findByCandidate(candidate);
        if (existingApp.isPresent()) {
            throw new RuntimeException("You have already submitted an application");
        }

        String resumeUrl = null;
        if (resume != null && !resume.isEmpty()) {
            resumeUrl = saveResume(resume, candidate.getEmail());
        }

        Application application = new Application(candidate, phone, skills, education, experience, resumeUrl, portfolioLink);
        // Set additional fields
        application.setFirstName(firstName);
        application.setLastName(lastName);
        application.setLocation(location);
        application.setLinkedinProfile(linkedinProfile);
        application.setGithubProfile(githubProfile);
        application.setAvailability(availability);
        application.setExpectedSalary(expectedSalary);
        application.setNoticePeriod(noticePeriod);
        application.setWorkMode(workMode);
        
        return applicationRepository.save(application);
    }

    public Application getApplicationByCandidate(User candidate) {
        return applicationRepository.findByCandidate(candidate)
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Application> getApplicationsByStatus(ApplicationStatus status) {
        return applicationRepository.findByStatus(status);
    }

    public Application updateApplicationStatus(@NonNull Long applicationId, ApplicationStatus status) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        
        application.setStatus(status);
        return applicationRepository.save(application);
    }

    public List<Application> searchApplications(String name, String skills, ApplicationStatus status) {
        if (name != null && !name.trim().isEmpty()) {
            return applicationRepository.findByCandidateNameContainingIgnoreCase(name);
        }
        if (skills != null && !skills.trim().isEmpty()) {
            return applicationRepository.findBySkillsContainingIgnoreCase(skills);
        }
        if (status != null) {
            return applicationRepository.findByStatus(status);
        }
        return getAllApplications();
    }

    private String saveResume(MultipartFile file, String userEmail) {
        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename != null ? 
                originalFilename.substring(originalFilename.lastIndexOf(".")) : ".pdf";
            String filename = userEmail.replace("@", "_").replace(".", "_") + "_resume" + fileExtension;
            
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath);
            
            return UPLOAD_DIR + filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to save resume file", e);
        }
    }

    public byte[] getResumeFile(String filename) throws IOException {
        Path filePath = Paths.get(filename);
        return Files.readAllBytes(filePath);
    }
}
