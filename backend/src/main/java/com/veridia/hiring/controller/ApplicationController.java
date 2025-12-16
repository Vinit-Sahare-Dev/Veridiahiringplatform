package com.veridia.hiring.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.veridia.hiring.dto.ApplicationRequest;
import com.veridia.hiring.model.Application;
import com.veridia.hiring.model.ApplicationStatus;
import com.veridia.hiring.model.Job;
import com.veridia.hiring.model.User;
import com.veridia.hiring.service.ApplicationService;
import com.veridia.hiring.service.EmailService;
import com.veridia.hiring.service.JobService;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/application")
@CrossOrigin(origins = "${CORS_ALLOWED_ORIGINS:http://localhost:5173,http://localhost:5174}")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JobService jobService;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping("/submit")
    public ResponseEntity<?> submitApplication(
            @RequestPart("application") String applicationJson,
            @RequestPart(value = "resume", required = false) MultipartFile resume,
            Authentication authentication) {
        try {
            System.out.println("=== Application Submission Started ===");
            
            // Parse application JSON
            ApplicationRequest applicationRequest = objectMapper.readValue(applicationJson, ApplicationRequest.class);
            System.out.println("Application request parsed: " + applicationRequest.getFirstName() + " " + applicationRequest.getLastName());
            
            User candidate = userService.getUserByEmail(authentication.getName());
            System.out.println("Found candidate: " + candidate.getName() + " (" + candidate.getEmail() + ")");
            
            Application application = applicationService.submitApplication(
                candidate,
                applicationRequest.getFirstName(),
                applicationRequest.getLastName(),
                applicationRequest.getPhone(),
                applicationRequest.getLocation(),
                applicationRequest.getLinkedinProfile(),
                applicationRequest.getGithubProfile(),
                applicationRequest.getPortfolioLink(),
                applicationRequest.getSkills(),
                applicationRequest.getEducation(),
                applicationRequest.getExperience(),
                applicationRequest.getAvailability(),
                applicationRequest.getExpectedSalary(),
                applicationRequest.getNoticePeriod(),
                applicationRequest.getWorkMode(),
                applicationRequest.getJobId() != null ? (Long) applicationRequest.getJobId() : null,
                resume
            );
            
            System.out.println("Application saved successfully with ID: " + application.getId());
            
            // Send email notification
            try {
                String jobTitle = "Position";
                if (applicationRequest.getJobId() != null) {
                    Job job = jobService.getJobById(applicationRequest.getJobId() != null ? applicationRequest.getJobId() : 0L);
                    if (job != null) {
                        jobTitle = job.getTitle();
                    }
                }
                
                // Use personalized email method
                String[] names = applicationRequest.getFirstName().split(" ", 2);
                String firstName = names.length > 0 ? names[0] : "Candidate";
                String lastName = names.length > 1 ? names[1] : "";
                
                emailService.sendApplicationSubmissionEmail(
                    candidate.getEmail(), 
                    firstName, 
                    lastName, 
                    jobTitle
                );
                System.out.println("Application submission email sent to: " + candidate.getEmail());
            } catch (Exception emailError) {
                System.err.println("Failed to send email: " + emailError.getMessage());
                // Don't fail the request if email fails
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Application submitted successfully");
            response.put("applicationId", application.getId());
            response.put("status", application.getStatus().name());
            
            System.out.println("=== Application Submission Completed Successfully ===");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("=== Application Submission Failed ===");
            System.err.println("Error type: " + e.getClass().getName());
            System.err.println("Error message: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to submit application: " + e.getMessage());
            errorResponse.put("error", e.getClass().getSimpleName());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyApplication(Authentication authentication) {
        try {
            User candidate = userService.getUserByEmail(authentication.getName());
            Application application = applicationService.getApplicationByCandidate(candidate);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", application.getId());
            response.put("firstName", application.getFirstName());
            response.put("lastName", application.getLastName());
            response.put("phone", application.getPhone());
            response.put("location", application.getLocation());
            response.put("linkedinProfile", application.getLinkedinProfile());
            response.put("githubProfile", application.getGithubProfile());
            response.put("portfolioLink", application.getPortfolioLink());
            response.put("skills", application.getSkills());
            response.put("education", application.getEducation());
            response.put("experience", application.getExperience());
            response.put("availability", application.getAvailability());
            response.put("expectedSalary", application.getExpectedSalary());
            response.put("noticePeriod", application.getNoticePeriod());
            response.put("workMode", application.getWorkMode());
            response.put("resumeUrl", application.getResumeUrl());
            response.put("status", application.getStatus().name());
            response.put("createdAt", application.getCreatedAt());
            response.put("updatedAt", application.getUpdatedAt());
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.err.println("Error fetching application: " + e.getMessage());
            return ResponseEntity.status(404).body(Map.of(
                "success", false,
                "message", "No application found"
            ));
        }
    }

    @GetMapping("/my-applications")
    public ResponseEntity<?> getMyApplications(Authentication authentication) {
        try {
            System.out.println("=== Fetching Applications ===");
            System.out.println("User: " + authentication.getName());
            
            User candidate = userService.getUserByEmail(authentication.getName());
            System.out.println("Found candidate: " + candidate.getName());
            
            List<Application> applications = applicationService.getApplicationsByCandidate(candidate);
            System.out.println("Found " + applications.size() + " applications");
            
            List<Map<String, Object>> response = applications.stream().map(app -> {
                Map<String, Object> appMap = new HashMap<>();
                appMap.put("id", app.getId());
                appMap.put("firstName", app.getFirstName());
                appMap.put("lastName", app.getLastName());
                appMap.put("email", candidate.getEmail());
                appMap.put("phone", app.getPhone());
                appMap.put("location", app.getLocation());
                appMap.put("linkedinProfile", app.getLinkedinProfile());
                appMap.put("githubProfile", app.getGithubProfile());
                appMap.put("portfolioLink", app.getPortfolioLink());
                appMap.put("skills", app.getSkills());
                appMap.put("education", app.getEducation());
                appMap.put("experience", app.getExperience());
                appMap.put("availability", app.getAvailability());
                appMap.put("expectedSalary", app.getExpectedSalary());
                appMap.put("noticePeriod", app.getNoticePeriod());
                appMap.put("workMode", app.getWorkMode());
                appMap.put("resumeFile", app.getResumeUrl() != null ? 
                    app.getResumeUrl().substring(app.getResumeUrl().lastIndexOf("/") + 1) : null);
                appMap.put("resumeUrl", app.getResumeUrl());
                appMap.put("status", app.getStatus().name());
                appMap.put("submittedAt", app.getCreatedAt());
                appMap.put("updatedAt", app.getUpdatedAt());
                appMap.put("jobId", app.getJobId());
                
                // Add job details if jobId exists
                if (app.getJobId() != null) {
                    try {
                        Job job = jobService.getJobById(app.getJobId() != null ? app.getJobId() : 0L);
                        if (job != null) {
                            appMap.put("jobTitle", job.getTitle());
                            appMap.put("jobDepartment", job.getDepartment());
                            appMap.put("jobLocation", job.getLocation());
                            appMap.put("jobType", job.getType());
                        } else {
                            appMap.put("jobTitle", "Position #" + app.getJobId());
                            appMap.put("jobDepartment", "Department");
                        }
                    } catch (Exception e) {
                        System.err.println("Error fetching job details for jobId " + app.getJobId() + ": " + e.getMessage());
                        appMap.put("jobTitle", "Position #" + app.getJobId());
                        appMap.put("jobDepartment", "Department");
                    }
                } else {
                    appMap.put("jobTitle", "General Application");
                    appMap.put("jobDepartment", "General");
                }
                
                return appMap;
            }).toList();
            
            System.out.println("Returning " + response.size() + " applications");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("=== Error Fetching Applications ===");
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Failed to fetch applications: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/check-job-application/{jobId}")
    public ResponseEntity<?> checkJobApplication(@PathVariable Long jobId, Authentication authentication) {
        try {
            User candidate = userService.getUserByEmail(authentication.getName());
            boolean hasApplied = applicationService.hasCandidateAppliedToJob(candidate, jobId);
            
            return ResponseEntity.ok(Map.of(
                "hasApplied", hasApplied,
                "jobId", jobId
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Failed to check job application: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllApplications() {
        try {
            System.out.println("=== Admin Applications Fetch Started ===");
            List<Application> applications = applicationService.getAllApplications();
            System.out.println("Found " + applications.size() + " applications in database");
            
            if (applications.isEmpty()) {
                System.out.println("No applications found in database");
            } else {
                System.out.println("Applications:");
                applications.forEach(app -> {
                    System.out.println("- ID: " + app.getId() + 
                                     ", Candidate: " + app.getCandidate().getName() + 
                                     ", Email: " + app.getCandidate().getEmail() +
                                     ", Status: " + app.getStatus());
                });
            }
            
            List<Map<String, Object>> response = applications.stream().map(app -> {
                Map<String, Object> appMap = new HashMap<>();
                appMap.put("id", app.getId());
                appMap.put("candidateName", app.getCandidate().getName());
                appMap.put("candidateEmail", app.getCandidate().getEmail());
                appMap.put("firstName", app.getFirstName());
                appMap.put("lastName", app.getLastName());
                appMap.put("phone", app.getPhone());
                appMap.put("location", app.getLocation());
                appMap.put("linkedinProfile", app.getLinkedinProfile());
                appMap.put("githubProfile", app.getGithubProfile());
                appMap.put("portfolioLink", app.getPortfolioLink());
                appMap.put("skills", app.getSkills());
                appMap.put("education", app.getEducation());
                appMap.put("experience", app.getExperience());
                appMap.put("availability", app.getAvailability());
                appMap.put("expectedSalary", app.getExpectedSalary());
                appMap.put("noticePeriod", app.getNoticePeriod());
                appMap.put("workMode", app.getWorkMode());
                appMap.put("resumeUrl", app.getResumeUrl());
                appMap.put("status", app.getStatus().name());
                appMap.put("createdAt", app.getCreatedAt());
                appMap.put("updatedAt", app.getUpdatedAt());
                appMap.put("jobId", app.getJobId());
                
                // Add job details if jobId exists
                if (app.getJobId() != null) {
                    try {
                        Job job = jobService.getJobById(app.getJobId() != null ? app.getJobId() : 0L);
                        if (job != null) {
                            appMap.put("jobTitle", job.getTitle());
                            appMap.put("jobDepartment", job.getDepartment());
                            appMap.put("jobLocation", job.getLocation());
                            appMap.put("jobType", job.getType());
                            System.out.println("Found job: " + job.getTitle() + " for application " + app.getId());
                        } else {
                            appMap.put("jobTitle", "Position #" + app.getJobId());
                            appMap.put("jobDepartment", "Department");
                            System.out.println("Job not found for ID: " + app.getJobId());
                        }
                    } catch (Exception e) {
                        System.err.println("Error fetching job details for jobId " + app.getJobId() + ": " + e.getMessage());
                        appMap.put("jobTitle", "Position #" + app.getJobId());
                        appMap.put("jobDepartment", "Department");
                    }
                } else {
                    appMap.put("jobTitle", "General Application");
                    appMap.put("jobDepartment", "General");
                    System.out.println("No jobId for application: " + app.getId());
                }
                
                return appMap;
            }).toList();
            
            System.out.println("=== Admin Applications Fetch Completed ===");
            System.out.println("Total applications: " + applications.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("=== Admin Applications Fetch Failed ===");
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Failed to fetch applications: " + e.getMessage()
            ));
        }
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
            try {
                String jobTitle = "Position";
                if (application.getJobId() != null) {
                    Job job = jobService.getJobById(application.getJobId() != null ? application.getJobId() : 0L);
                    if (job != null) {
                        jobTitle = job.getTitle();
                    }
                }
                
                String[] names = application.getFirstName().split(" ", 2);
                String firstName = names.length > 0 ? names[0] : "Candidate";
                String lastName = names.length > 1 ? names[1] : "";
                
                emailService.sendStatusUpdateEmail(
                    application.getCandidate().getEmail(),
                    firstName,
                    lastName,
                    newStatus.name(),
                    jobTitle
                );
            } catch (Exception emailError) {
                System.err.println("Failed to send status update email: " + emailError.getMessage());
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Application status updated successfully");
            response.put("newStatus", application.getStatus().name());
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
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
            appMap.put("firstName", app.getFirstName());
            appMap.put("lastName", app.getLastName());
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
            
            if (resumeContent == null) {
                return ResponseEntity.notFound().build();
            }
            
            ByteArrayResource resource = new ByteArrayResource(resumeContent);
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.valueOf(MediaType.APPLICATION_PDF_VALUE))
                    .contentLength(resumeContent.length)
                    .body(resource);
        } catch (Exception e) {
            System.err.println("Error downloading resume: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
}
