package com.veridia.hiring.controller;

import com.veridia.hiring.model.User;
import com.veridia.hiring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/candidate")
@CrossOrigin(origins = "${CORS_ALLOWED_ORIGINS:http://localhost:5173,http://localhost:5174}")
public class CandidateController {

    @Autowired
    private UserService userService;

    private final String UPLOAD_DIR = "uploads/profile-photos/";

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentCandidate(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole().name());
        response.put("profilePhoto", user.getProfilePhoto());
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/upload-photo")
    public ResponseEntity<?> uploadProfilePhoto(@RequestParam("profilePhoto") MultipartFile file, 
                                            Authentication authentication) {
        try {
            User user = userService.getUserByEmail(authentication.getName());
            
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }
            
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body("Only image files are allowed");
            }
            
            if (file.getSize() > 5 * 1024 * 1024) { // 5MB limit
                return ResponseEntity.badRequest().body("File size should be less than 5MB");
            }
            
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid filename");
            }
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = user.getEmail().replaceAll("[^a-zA-Z0-9._-]", "_") + "_" + 
                             UUID.randomUUID().toString().substring(0, 8) + 
                             "_profile" + fileExtension;
            
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath);
            
            String profilePhotoUrl = UPLOAD_DIR + filename;
            
            // Update user's profile photo in database
            userService.updateProfilePhoto(user.getId() != null ? user.getId() : 0L, profilePhotoUrl);
            
            Map<String, Object> response = new HashMap<>();
            response.put("profilePhotoUrl", profilePhotoUrl);
            response.put("message", "Profile photo uploaded successfully");
            
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to upload photo: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateCandidate(@Valid @RequestBody Map<String, String> updateRequest, 
                                            Authentication authentication) {
        try {
            String name = updateRequest.get("name");
            String email = updateRequest.get("email");
            String profilePhoto = updateRequest.get("profilePhoto");
            
            User updatedUser = userService.updateUser(null, name, email);
            
            // Update profile photo if provided
            if (profilePhoto != null && !profilePhoto.trim().isEmpty()) {
                userService.updateProfilePhoto(updatedUser.getId() != null ? updatedUser.getId() : 0L, profilePhoto);
                updatedUser.setProfilePhoto(profilePhoto);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", updatedUser.getId());
            response.put("name", updatedUser.getName());
            response.put("email", updatedUser.getEmail());
            response.put("role", updatedUser.getRole().name());
            response.put("profilePhoto", updatedUser.getProfilePhoto());
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
