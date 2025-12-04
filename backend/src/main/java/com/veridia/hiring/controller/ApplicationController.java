package com.veridia.hiring.controller;

import com.veridia.hiring.dto.ApplicationRequest;
import com.veridia.hiring.model.Application;
import com.veridia.hiring.model.ApplicationStatus;
import com.veridia.hiring.model.User;
import com.veridia.hiring.service.ApplicationService;
import com.veridia.hiring.service.EmailService;
import com.veridia.hiring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/application")
@CrossOrigin(origins = "http://localhost:5173")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/submit")
    public ResponseEntity<?> submitApplication(
            @Valid @RequestPart("application") ApplicationRequest applicationRequest,
            @RequestPart(value = "resume", required = false) MultipartFile resume,
            Authentication authentication) {
        try {
            User candidate = userService.getUserByEmail(authentication.getName());
            
            Application application = applicationService.submitApplication(
                candidate,
                applicationRequest.getPhone(),
                applicationRequest.getSkills(),
                applicationRequest.getEducation(),
                applicationRequest.getExperience(),
                resume,
                applicationRequest.getPortfolioLink()
            );
            
            // Send email notification
            emailService.sendApplicationSubmissionEmail(candidate.getEmail(), candidate.getName());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Application submitted successfully");
            response.put("applicationId", application.getId());
            response.put("status", application.getStatus().name());
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyApplication(Authentication authentication) {
        User candidate = userService.getUserByEmail(authentication.getName());
        Application application = applicationService.getApplicationByCandidate(candidate);
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", application.getId());
        response.put("phone", application.getPhone());
        response.put("skills", application.getSkills());
        response.put("education", application.getEducation());
        response.put("experience", application.getExperience());
        response.put("portfolioLink", application.getPortfolioLink());
        response.put("resumeUrl", application.getResumeUrl());
        response.put("status", application.getStatus().name());
        response.put("createdAt", application.getCreatedAt());
        response.put("updatedAt", application.getUpdatedAt());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllApplications() {
        List<Application> applications = applicationService.getAllApplications();
        
        return ResponseEntity.ok(applications.stream().map(app -> {
            Map<String, Object> appMap = new HashMap<>();
            appMap.put("id", app.getId());
            appMap.put("candidateName", app.getCandidate().getName());
            appMap.put("candidateEmail", app.getCandidate().getEmail());
            appMap.put("phone", app.getPhone());
            appMap.put("skills", app.getSkills());
            appMap.put("education", app.getEducation());
            appMap.put("experience", app.getExperience());
            appMap.put("portfolioLink", app.getPortfolioLink());
            appMap.put("resumeUrl", app.getResumeUrl());
            appMap.put("status", app.getStatus().name());
            appMap.put("createdAt", app.getCreatedAt());
            appMap.put("updatedAt", app.getUpdatedAt());
            return appMap;
        }).toList());
    }

    @PutMapping("/admin/update-status/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable @NonNull Long id,
            @RequestBody Map<String, String> statusRequest) {
        try {
            String statusStr = statusRequest.get("status");
            ApplicationStatus newStatus = ApplicationStatus.valueOf(statusStr.toUpperCase());
            
            Application application = applicationService.updateApplicationStatus(id, newStatus);
            
            // Send email notification
            emailService.sendStatusUpdateEmail(
                application.getCandidate().getEmail(),
                application.getCandidate().getName(),
                newStatus.name()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Application status updated successfully");
            response.put("newStatus", application.getStatus().name());
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/admin/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> searchApplications(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String skills,
            @RequestParam(required = false) String status) {
        
        ApplicationStatus statusEnum = null;
        if (status != null && !status.trim().isEmpty()) {
            statusEnum = ApplicationStatus.valueOf(status.toUpperCase());
        }
        
        List<Application> applications = applicationService.searchApplications(name, skills, statusEnum);
        
        return ResponseEntity.ok(applications.stream().map(app -> {
            Map<String, Object> appMap = new HashMap<>();
            appMap.put("id", app.getId());
            appMap.put("candidateName", app.getCandidate().getName());
            appMap.put("candidateEmail", app.getCandidate().getEmail());
            appMap.put("phone", app.getPhone());
            appMap.put("skills", app.getSkills());
            appMap.put("education", app.getEducation());
            appMap.put("experience", app.getExperience());
            appMap.put("portfolioLink", app.getPortfolioLink());
            appMap.put("resumeUrl", app.getResumeUrl());
            appMap.put("status", app.getStatus().name());
            appMap.put("createdAt", app.getCreatedAt());
            appMap.put("updatedAt", app.getUpdatedAt());
            return appMap;
        }).toList());
    }

    @GetMapping("/admin/resume/{filename}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> downloadResume(@PathVariable @NonNull String filename) {
        try {
            byte[] resumeContent = applicationService.getResumeFile("uploads/resumes/" + filename);
            
            ByteArrayResource resource = new ByteArrayResource(resumeContent);
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .contentLength(resumeContent.length)
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
