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
@CrossOrigin(origins = "http://localhost:5173,http://localhost:5174")
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
}
