package com.veridia.hiring.repository;

import com.veridia.hiring.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    
    List<Job> findByFeaturedTrue();
    
    List<Job> findByCategory(String category);
    
    List<Job> findByLocationContainingIgnoreCase(String location);
    
    @Query("SELECT j FROM Job j WHERE " +
           "(:category = 'all' OR j.category = :category) AND " +
           "(:location = 'all' OR j.location LIKE %:location% OR j.location = 'Remote') AND " +
           "(j.title LIKE %:search% OR j.description LIKE %:search%)")
    List<Job> findJobsWithFilters(@Param("search") String search, 
                                  @Param("category") String category, 
                                  @Param("location") String location);
    
    @Query("SELECT DISTINCT j.category FROM Job j")
    List<String> findAllCategories();
    
    @Query("SELECT DISTINCT j.location FROM Job j WHERE j.location NOT LIKE '%Remote%'")
    List<String> findAllLocations();
}
