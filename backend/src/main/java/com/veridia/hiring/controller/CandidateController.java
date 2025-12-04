package com.veridia.hiring.controller;

import com.veridia.hiring.model.User;
import com.veridia.hiring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/candidate")
@CrossOrigin(origins = "http://localhost:5173")
public class CandidateController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentCandidate(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole().name());
        
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateCandidate(@Valid @RequestBody Map<String, String> updateRequest, 
                                            Authentication authentication) {
        try {
            String name = updateRequest.get("name");
            String email = updateRequest.get("email");
            
            User updatedUser = userService.updateUser(null, name, email);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", updatedUser.getId());
            response.put("name", updatedUser.getName());
            response.put("email", updatedUser.getEmail());
            response.put("role", updatedUser.getRole().name());
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
