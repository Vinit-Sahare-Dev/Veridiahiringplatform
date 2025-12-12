package com.veridia.hiring.controller;

import com.veridia.hiring.model.Job;
import com.veridia.hiring.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/setup")
@CrossOrigin(origins = "${CORS_ALLOWED_ORIGINS:http://localhost:5173,http://localhost:5174}")
public class SetupController {

    @Autowired
    private JobService jobService;

    @PostMapping("/create-jobs")
    public ResponseEntity<?> createSampleJobs() {
        try {
            // Create sample jobs
            Job job1 = new Job();
            job1.setTitle("Senior Software Engineer");
            job1.setDepartment("Engineering");
            job1.setLocation("Remote");
            job1.setType("Full-time");
            job1.setExperience("5+ years");
            job1.setSalary("$120k - $180k");
            job1.setCategory("Engineering");
            job1.setDescription("We are looking for a Senior Software Engineer to join our team and help build amazing products.");
            job1.setRequirements("5+ years of experience, Java, Spring Boot, React, Microservices");
            job1.setPosted("true");
            job1.setApplicants(0);
            job1.setFeatured(true);
            
            Job job2 = new Job();
            job2.setTitle("Frontend Developer");
            job2.setDepartment("Engineering");
            job2.setLocation("Hybrid");
            job2.setType("Full-time");
            job2.setExperience("3+ years");
            job2.setSalary("$80k - $120k");
            job2.setCategory("Engineering");
            job2.setDescription("We are looking for a Frontend Developer to create beautiful and responsive user interfaces.");
            job2.setRequirements("3+ years of experience, React, TypeScript, CSS, HTML5");
            job2.setPosted("true");
            job2.setApplicants(0);
            job2.setFeatured(false);
            
            Job job3 = new Job();
            job3.setTitle("Product Manager");
            job3.setDepartment("Product");
            job3.setLocation("On-site");
            job3.setType("Full-time");
            job3.setExperience("4+ years");
            job3.setSalary("$100k - $150k");
            job3.setCategory("Product");
            job3.setDescription("We are looking for a Product Manager to drive product strategy and development.");
            job3.setRequirements("4+ years of experience, Product management, Agile, Analytics");
            job3.setPosted("true");
            job3.setApplicants(0);
            job3.setFeatured(true);
            
            Job job4 = new Job();
            job4.setTitle("Backend Developer");
            job4.setDepartment("Engineering");
            job4.setLocation("Remote");
            job4.setType("Full-time");
            job4.setExperience("4+ years");
            job4.setSalary("$90k - $140k");
            job4.setCategory("Engineering");
            job4.setDescription("We are looking for a Backend Developer to build scalable server-side applications.");
            job4.setRequirements("4+ years of experience, Java, Spring Boot, PostgreSQL, REST APIs");
            job4.setPosted("true");
            job4.setApplicants(0);
            job4.setFeatured(false);
            
            Job job5 = new Job();
            job5.setTitle("DevOps Engineer");
            job5.setDepartment("Engineering");
            job5.setLocation("Remote");
            job5.setType("Full-time");
            job5.setExperience("3+ years");
            job5.setSalary("$95k - $145k");
            job5.setCategory("Engineering");
            job5.setDescription("We are looking for a DevOps Engineer to manage our infrastructure and deployment pipelines.");
            job5.setRequirements("3+ years of experience, Docker, Kubernetes, AWS, CI/CD");
            job5.setPosted("true");
            job5.setApplicants(0);
            job5.setFeatured(false);
            
            Job job6 = new Job();
            job6.setTitle("UX Designer");
            job6.setDepartment("Design");
            job6.setLocation("Hybrid");
            job6.setType("Full-time");
            job6.setExperience("2+ years");
            job6.setSalary("$70k - $110k");
            job6.setCategory("Design");
            job6.setDescription("We are looking for a UX Designer to create amazing user experiences.");
            job6.setRequirements("2+ years of experience, Figma, Adobe XD, User Research");
            job6.setPosted("true");
            job6.setApplicants(0);
            job6.setFeatured(false);
            
            // Save all jobs
            jobService.createJob(job1);
            jobService.createJob(job2);
            jobService.createJob(job3);
            jobService.createJob(job4);
            jobService.createJob(job5);
            jobService.createJob(job6);
            
            return ResponseEntity.ok(Map.of(
                "message", "Sample jobs created successfully",
                "jobsCreated", 6,
                "jobs", Map.of(
                    "Senior Software Engineer", job1.getId(),
                    "Frontend Developer", job2.getId(),
                    "Product Manager", job3.getId(),
                    "Backend Developer", job4.getId(),
                    "DevOps Engineer", job5.getId(),
                    "UX Designer", job6.getId()
                )
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "error", "Failed to create sample jobs: " + e.getMessage()
            ));
        }
    }
}
