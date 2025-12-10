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
import java.util.Set;
import java.util.UUID;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    private final String UPLOAD_DIR = "uploads/resumes/";
    
    // File validation constants
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("pdf", "doc", "docx");
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    public Application submitApplication(
            User candidate, 
            String firstName, 
            String lastName, 
            String phone, 
            String location, 
            String linkedinProfile, 
            String githubProfile, 
            String portfolioLink, 
            String skills, 
            String education, 
            String experience,
            String availability, 
            String expectedSalary, 
            String noticePeriod, 
            String workMode, 
            Long jobId,
            MultipartFile resume) {
        
        try {
            // Check if candidate already has applications
            List<Application> existingApps = applicationRepository.findAllByCandidate(candidate);
            
            // Create new application
            Application application = new Application(candidate, firstName, lastName, phone);
            
            // Set all fields
            application.setJobId(jobId);
            application.setLocation(location);
            application.setLinkedinProfile(linkedinProfile);
            application.setGithubProfile(githubProfile);
            application.setPortfolioLink(portfolioLink);
            application.setSkills(skills);
            application.setEducation(education);
            application.setExperience(experience);
            application.setAvailability(availability);
            application.setExpectedSalary(expectedSalary);
            application.setNoticePeriod(noticePeriod);
            application.setWorkMode(workMode != null ? workMode : "remote");
            application.setStatus(ApplicationStatus.PENDING);
            
            // Handle resume upload
            if (resume != null && !resume.isEmpty()) {
                validateResumeFile(resume);
                String resumeUrl = saveResume(resume, candidate.getEmail());
                application.setResumeUrl(resumeUrl);
            }
            
            return applicationRepository.save(application);
            
        } catch (Exception e) {
            System.err.println("Error submitting application: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to submit application: " + e.getMessage());
        }
    }

    public Application getApplicationByCandidate(User candidate) {
        return applicationRepository.findByCandidate(candidate)
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }

    public List<Application> getApplicationsByCandidate(User candidate) {
        return applicationRepository.findAllByCandidate(candidate);
    }

    public boolean hasCandidateAppliedToJob(User candidate, Long jobId) {
        return applicationRepository.findByCandidateAndJobId(candidate, jobId).isPresent();
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
            if (originalFilename == null || originalFilename.trim().isEmpty()) {
                throw new RuntimeException("Invalid filename");
            }
            
            String fileExtension = getFileExtension(originalFilename);
            String filename = sanitizeFilename(userEmail) + "_" + 
                             UUID.randomUUID().toString().substring(0, 8) + 
                             "_resume" + fileExtension;
            
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath);
            
            return UPLOAD_DIR + filename;
        } catch (IOException e) {
            System.err.println("Failed to save resume: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to save resume file: " + e.getMessage());
        }
    }
    
    private void validateResumeFile(MultipartFile file) {
        // Check file size
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException("File size exceeds maximum limit of 10MB");
        }
        
        // Check if file is empty
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }
        
        // Check file extension
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new RuntimeException("Invalid filename");
        }
        
        String fileExtension = getFileExtension(originalFilename);
        if (!ALLOWED_EXTENSIONS.contains(fileExtension.toLowerCase())) {
            throw new RuntimeException("Invalid file type. Only PDF, DOC, and DOCX files are allowed");
        }
        
        // Check MIME type
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType)) {
            throw new RuntimeException("Invalid file type. Only PDF, DOC, and DOCX files are allowed");
        }
    }
    
    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1 || lastDotIndex == filename.length() - 1) {
            throw new RuntimeException("Invalid file extension");
        }
        return filename.substring(lastDotIndex + 1);
    }
    
    private String sanitizeFilename(String filename) {
        return filename.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    public byte[] getResumeFile(String filename) throws IOException {
        Path filePath = Paths.get(filename);
        return Files.readAllBytes(filePath);
    }
}