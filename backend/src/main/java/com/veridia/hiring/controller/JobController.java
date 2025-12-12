package com.veridia.hiring.controller;

import com.veridia.hiring.model.Job;
import com.veridia.hiring.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "${CORS_ALLOWED_ORIGINS:http://localhost:5173,http://localhost:5174}")
public class JobController {

    @Autowired
    private JobService jobService;

    @GetMapping
    public ResponseEntity<?> getAllJobs() {
        List<Job> jobs = jobService.getAllJobs();
        
        return ResponseEntity.ok(jobs.stream().map(job -> {
            Map<String, Object> jobMap = new HashMap<>();
            jobMap.put("id", job.getId());
            jobMap.put("title", job.getTitle());
            jobMap.put("department", job.getDepartment());
            jobMap.put("location", job.getLocation());
            jobMap.put("type", job.getType());
            jobMap.put("experience", job.getExperience());
            jobMap.put("salary", job.getSalary());
            jobMap.put("category", job.getCategory());
            jobMap.put("description", job.getDescription());
            jobMap.put("requirements", job.getRequirements());
            jobMap.put("posted", job.getPosted());
            jobMap.put("applicants", job.getApplicants());
            jobMap.put("featured", job.getFeatured());
            jobMap.put("createdAt", job.getCreatedAt());
            jobMap.put("updatedAt", job.getUpdatedAt());
            return jobMap;
        }).toList());
    }

    @GetMapping("/featured")
    public ResponseEntity<?> getFeaturedJobs() {
        List<Job> jobs = jobService.getFeaturedJobs();
        
        return ResponseEntity.ok(jobs.stream().map(job -> {
            Map<String, Object> jobMap = new HashMap<>();
            jobMap.put("id", job.getId());
            jobMap.put("title", job.getTitle());
            jobMap.put("department", job.getDepartment());
            jobMap.put("location", job.getLocation());
            jobMap.put("type", job.getType());
            jobMap.put("experience", job.getExperience());
            jobMap.put("salary", job.getSalary());
            jobMap.put("category", job.getCategory());
            jobMap.put("description", job.getDescription());
            jobMap.put("requirements", job.getRequirements());
            jobMap.put("posted", job.getPosted());
            jobMap.put("applicants", job.getApplicants());
            jobMap.put("featured", job.getFeatured());
            return jobMap;
        }).toList());
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchJobs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location) {
        
        List<Job> jobs = jobService.searchJobs(
            search != null ? search : "",
            category != null ? category : "all", 
            location != null ? location : "all"
        );
        
        return ResponseEntity.ok(jobs.stream().map(job -> {
            Map<String, Object> jobMap = new HashMap<>();
            jobMap.put("id", job.getId());
            jobMap.put("title", job.getTitle());
            jobMap.put("department", job.getDepartment());
            jobMap.put("location", job.getLocation());
            jobMap.put("type", job.getType());
            jobMap.put("experience", job.getExperience());
            jobMap.put("salary", job.getSalary());
            jobMap.put("category", job.getCategory());
            jobMap.put("description", job.getDescription());
            jobMap.put("requirements", job.getRequirements());
            jobMap.put("posted", job.getPosted());
            jobMap.put("applicants", job.getApplicants());
            jobMap.put("featured", job.getFeatured());
            return jobMap;
        }).toList());
    }

    @GetMapping("/filters")
    public ResponseEntity<?> getJobFilters() {
        Map<String, Object> filters = jobService.getJobFilters();
        return ResponseEntity.ok(filters);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable @NonNull Long id) {
        Job job = jobService.getJobById(id);
        if (job != null) {
            Map<String, Object> jobMap = new HashMap<>();
            jobMap.put("id", job.getId());
            jobMap.put("title", job.getTitle());
            jobMap.put("department", job.getDepartment());
            jobMap.put("location", job.getLocation());
            jobMap.put("type", job.getType());
            jobMap.put("experience", job.getExperience());
            jobMap.put("salary", job.getSalary());
            jobMap.put("category", job.getCategory());
            jobMap.put("description", job.getDescription());
            jobMap.put("requirements", job.getRequirements());
            jobMap.put("posted", job.getPosted());
            jobMap.put("applicants", job.getApplicants());
            jobMap.put("featured", job.getFeatured());
            jobMap.put("createdAt", job.getCreatedAt());
            jobMap.put("updatedAt", job.getUpdatedAt());
            return ResponseEntity.ok(jobMap);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<?> createJob(@RequestBody @NonNull Job job) {
        Job createdJob = jobService.createJob(job);
        return ResponseEntity.ok(createdJob);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateJob(@PathVariable @NonNull Long id, @RequestBody @NonNull Job jobDetails) {
        Job updatedJob = jobService.updateJob(id, jobDetails);
        if (updatedJob != null) {
            return ResponseEntity.ok(updatedJob);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable @NonNull Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok().body("Job deleted successfully");
    }

    // Admin-only endpoints for job management
    @PostMapping("/admin/create")
    public ResponseEntity<?> createJobAdmin(@RequestBody @NonNull Job job) {
        try {
            // Ensure required fields are set
            if (job.getTitle() == null || job.getTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Job title is required");
            }
            if (job.getDepartment() == null || job.getDepartment().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Department is required");
            }
            if (job.getLocation() == null || job.getLocation().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Location is required");
            }
            
            // Set default values if not provided
            if (job.getPosted() == null) {
                job.setPosted("true");
            }
            if (job.getApplicants() == null) {
                job.setApplicants(0);
            }
            if (job.getFeatured() == null) {
                job.setFeatured(false);
            }
            
            Job createdJob = jobService.createJob(job);
            
            // Return the created job with all details
            Map<String, Object> response = new HashMap<>();
            response.put("id", createdJob.getId());
            response.put("title", createdJob.getTitle());
            response.put("department", createdJob.getDepartment());
            response.put("location", createdJob.getLocation());
            response.put("type", createdJob.getType());
            response.put("experience", createdJob.getExperience());
            response.put("salary", createdJob.getSalary());
            response.put("category", createdJob.getCategory());
            response.put("description", createdJob.getDescription());
            response.put("requirements", createdJob.getRequirements());
            response.put("posted", createdJob.getPosted());
            response.put("applicants", createdJob.getApplicants());
            response.put("featured", createdJob.getFeatured());
            response.put("createdAt", createdJob.getCreatedAt());
            response.put("updatedAt", createdJob.getUpdatedAt());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating job: " + e.getMessage());
        }
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<?> updateJobAdmin(@PathVariable @NonNull Long id, @RequestBody @NonNull Job jobDetails) {
        try {
            // Validate required fields
            if (jobDetails.getTitle() == null || jobDetails.getTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Job title is required");
            }
            if (jobDetails.getDepartment() == null || jobDetails.getDepartment().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Department is required");
            }
            if (jobDetails.getLocation() == null || jobDetails.getLocation().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Location is required");
            }
            
            Job existingJob = jobService.getJobById(id);
            if (existingJob == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Update fields
            existingJob.setTitle(jobDetails.getTitle());
            existingJob.setDepartment(jobDetails.getDepartment());
            existingJob.setLocation(jobDetails.getLocation());
            existingJob.setType(jobDetails.getType());
            existingJob.setExperience(jobDetails.getExperience());
            existingJob.setSalary(jobDetails.getSalary());
            existingJob.setCategory(jobDetails.getCategory());
            existingJob.setDescription(jobDetails.getDescription());
            existingJob.setRequirements(jobDetails.getRequirements());
            existingJob.setFeatured(jobDetails.getFeatured());
            
            Job updatedJob = jobService.updateJob(id, existingJob);
            
            // Return the updated job with all details
            Map<String, Object> response = new HashMap<>();
            response.put("id", updatedJob.getId());
            response.put("title", updatedJob.getTitle());
            response.put("department", updatedJob.getDepartment());
            response.put("location", updatedJob.getLocation());
            response.put("type", updatedJob.getType());
            response.put("experience", updatedJob.getExperience());
            response.put("salary", updatedJob.getSalary());
            response.put("category", updatedJob.getCategory());
            response.put("description", updatedJob.getDescription());
            response.put("requirements", updatedJob.getRequirements());
            response.put("posted", updatedJob.getPosted());
            response.put("applicants", updatedJob.getApplicants());
            response.put("featured", updatedJob.getFeatured());
            response.put("createdAt", updatedJob.getCreatedAt());
            response.put("updatedAt", updatedJob.getUpdatedAt());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating job: " + e.getMessage());
        }
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> deleteJobAdmin(@PathVariable @NonNull Long id) {
        try {
            Job existingJob = jobService.getJobById(id);
            if (existingJob == null) {
                return ResponseEntity.notFound().build();
            }
            
            jobService.deleteJob(id);
            return ResponseEntity.ok().body("Job deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting job: " + e.getMessage());
        }
    }

    @GetMapping("/admin/all")
    public ResponseEntity<?> getAllJobsAdmin() {
        try {
            List<Job> jobs = jobService.getAllJobs();
            
            return ResponseEntity.ok(jobs.stream().map(job -> {
                Map<String, Object> jobMap = new HashMap<>();
                jobMap.put("id", job.getId());
                jobMap.put("title", job.getTitle());
                jobMap.put("department", job.getDepartment());
                jobMap.put("location", job.getLocation());
                jobMap.put("type", job.getType());
                jobMap.put("experience", job.getExperience());
                jobMap.put("salary", job.getSalary());
                jobMap.put("category", job.getCategory());
                jobMap.put("description", job.getDescription());
                jobMap.put("requirements", job.getRequirements());
                jobMap.put("posted", job.getPosted());
                jobMap.put("applicants", job.getApplicants());
                jobMap.put("featured", job.getFeatured());
                jobMap.put("createdAt", job.getCreatedAt());
                jobMap.put("updatedAt", job.getUpdatedAt());
                return jobMap;
            }).toList());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching jobs: " + e.getMessage());
        }
    }
}
