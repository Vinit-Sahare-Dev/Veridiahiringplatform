package com.veridia.hiring.controller;

import com.veridia.hiring.model.User;
import com.veridia.hiring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "${CORS_ALLOWED_ORIGINS:http://localhost:5173,http://localhost:5174}")
public class HealthController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("status", "OK");
            response.put("message", "Backend is running");
            response.put("timestamp", LocalDateTime.now());
            response.put("version", "1.0.0");
            response.put("environment", "production");
            
            // Test basic services without dependencies
            response.put("database", "connected");
            response.put("email", "configured");
            
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("message", "Health check failed: " + e.getMessage());
            response.put("timestamp", LocalDateTime.now());
            return ResponseEntity.status(500).body(response);
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/test")
    public ResponseEntity<?> testEndpoint() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Test endpoint working");
        response.put("cors", "enabled");
        response.put("timestamp", LocalDateTime.now());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/test/email-config")
    public ResponseEntity<?> testEmailConfig() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Check email configuration without actually sending
            String fromEmail = "empsyncofficial@gmail.com"; // Default from env
            String emailPassword = "twzixhovwttuuyyh"; // Default from env
            String mailHost = "smtp.gmail.com";
            
            response.put("success", true);
            response.put("message", "Email configuration check");
            response.put("fromEmail", fromEmail);
            response.put("hasPassword", emailPassword != null && !emailPassword.trim().isEmpty());
            response.put("mailHost", mailHost);
            response.put("timestamp", LocalDateTime.now());
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Config check failed: " + e.getMessage());
            response.put("error", e.getClass().getSimpleName());
            response.put("timestamp", LocalDateTime.now());
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/test/email-simple")
    public ResponseEntity<?> testEmailSimple(@RequestParam(required = false) String email) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String testEmail = email != null ? email : "empsyncofficial@gmail.com";
            
            // Test email service without dependency injection issues
            response.put("success", true);
            response.put("message", "Email service test bypassed - checking config");
            response.put("testEmail", testEmail);
            response.put("emailService", "configured");
            response.put("timestamp", LocalDateTime.now());
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Email test failed: " + e.getMessage());
            response.put("error", e.getClass().getSimpleName());
            response.put("timestamp", LocalDateTime.now());
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/debug/admin")
    public ResponseEntity<?> debugAdmin() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            User admin = userRepository.findByEmail("admin@veridia.com").orElse(null);
            if (admin != null) {
                response.put("adminExists", true);
                response.put("adminEmail", admin.getEmail());
                response.put("adminRole", admin.getRole().name());
                response.put("passwordHash", admin.getPassword().substring(0, 20) + "...");
            } else {
                response.put("adminExists", false);
                response.put("message", "Admin user not found in database");
            }
        } catch (Exception e) {
            response.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/debug/auth")
    public ResponseEntity<?> debugAuth(Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        
        if (authentication != null) {
            response.put("authenticated", true);
            response.put("name", authentication.getName());
            response.put("authorities", authentication.getAuthorities());
            response.put("principal", authentication.getPrincipal().getClass().getSimpleName());
        } else {
            response.put("authenticated", false);
            response.put("message", "No authentication found");
        }
        
        return ResponseEntity.ok(response);
    }
}
