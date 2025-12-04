package com.veridia.hiring.repository;

import com.veridia.hiring.model.Application;
import com.veridia.hiring.model.ApplicationStatus;
import com.veridia.hiring.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    Optional<Application> findByCandidate(User candidate);
    List<Application> findByStatus(ApplicationStatus status);
    List<Application> findByCandidateId(Long candidateId);
    List<Application> findByCandidateNameContainingIgnoreCase(String name);
    List<Application> findBySkillsContainingIgnoreCase(String skills);
    List<Application> findAllByOrderByCreatedAtDesc();
}
