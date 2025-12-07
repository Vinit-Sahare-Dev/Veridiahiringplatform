package com.veridia.hiring.service;

import com.veridia.hiring.model.Job;
import com.veridia.hiring.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public List<Job> getFeaturedJobs() {
        return jobRepository.findByFeaturedTrue();
    }

    public List<Job> getJobsByCategory(@NonNull String category) {
        return jobRepository.findByCategory(category);
    }

    public List<Job> getJobsByLocation(@NonNull String location) {
        return jobRepository.findByLocationContainingIgnoreCase(location);
    }

    public List<Job> searchJobs(@NonNull String search, @NonNull String category, @NonNull String location) {
        return jobRepository.findJobsWithFilters(search, category, location);
    }

    public Job getJobById(@NonNull Long id) {
        return jobRepository.findById(id).orElse(null);
    }

    public Job createJob(@NonNull Job job) {
        return jobRepository.save(job);
    }

    public Job updateJob(@NonNull Long id, @NonNull Job jobDetails) {
        Job job = getJobById(id);
        if (job != null) {
            job.setTitle(jobDetails.getTitle());
            job.setDepartment(jobDetails.getDepartment());
            job.setLocation(jobDetails.getLocation());
            job.setType(jobDetails.getType());
            job.setExperience(jobDetails.getExperience());
            job.setSalary(jobDetails.getSalary());
            job.setCategory(jobDetails.getCategory());
            job.setDescription(jobDetails.getDescription());
            job.setRequirements(jobDetails.getRequirements());
            job.setPosted(jobDetails.getPosted());
            job.setFeatured(jobDetails.getFeatured());
            return jobRepository.save(job);
        }
        return null;
    }

    public void deleteJob(@NonNull Long id) {
        jobRepository.deleteById(id);
    }

    public Map<String, Object> getJobFilters() {
        Map<String, Object> filters = new HashMap<>();
        
        // Get categories with counts
        List<String> categories = jobRepository.findAllCategories();
        Map<String, Integer> categoryCounts = new HashMap<>();
        categoryCounts.put("all", getAllJobs().size());
        
        for (String category : categories) {
            if (category != null) {
                categoryCounts.put(category, getJobsByCategory(category).size());
            }
        }
        filters.put("categories", categoryCounts);
        
        // Get locations
        List<String> locations = jobRepository.findAllLocations();
        Map<String, String> locationOptions = new HashMap<>();
        locationOptions.put("all", "All Locations");
        locationOptions.put("remote", "Remote");
        
        for (String location : locations) {
            String locationKey = location.toLowerCase().replace(" ", "-");
            locationOptions.put(locationKey, location);
        }
        filters.put("locations", locationOptions);
        
        return filters;
    }
}
