package com.veridia.hiring.controller;

import com.veridia.hiring.dto.ApiResponse;
import com.veridia.hiring.dto.AuthRequest;
import com.veridia.hiring.dto.AuthResponse;
import com.veridia.hiring.dto.RegisterRequest;
import com.veridia.hiring.model.Role;
import com.veridia.hiring.model.User;
import com.veridia.hiring.service.UserService;
import com.veridia.hiring.service.EmailService;
import com.veridia.hiring.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${CORS_ALLOWED_ORIGINS:http://localhost:5173,http://localhost:5174}")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Map<String, Object>>> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            User user = userService.registerUser(
                registerRequest.getName(), 
                registerRequest.getEmail(), 
                registerRequest.getPassword(), 
                Role.CANDIDATE
            );
            
            // Send welcome email asynchronously (non-blocking)
            try {
                String[] names = registerRequest.getName().split(" ", 2);
                String firstName = names.length > 0 ? names[0] : "User";
                String lastName = names.length > 1 ? names[1] : "";
                
                // Send email in background thread to avoid blocking registration
                CompletableFuture.runAsync(() -> {
                    try {
                        emailService.sendWelcomeEmail(user.getEmail(), firstName, lastName);
                        System.out.println("Welcome email sent to: " + user.getEmail());
                    } catch (Exception emailError) {
                        System.err.println("Failed to send welcome email: " + emailError.getMessage());
                        // Don't fail registration if email fails
                    }
                });
            } catch (Exception emailError) {
                System.err.println("Email service initialization failed: " + emailError.getMessage());
                // Don't fail registration if email service fails
            }
            
            Map<String, Object> userData = new HashMap<>();
            userData.put("email", user.getEmail());
            userData.put("name", user.getName());
            userData.put("role", user.getRole().name());
            
            ApiResponse<Map<String, Object>> response = ApiResponse.success("User registered successfully. Welcome email sent!", userData);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            ApiResponse<Map<String, Object>> response = ApiResponse.error(e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> loginUser(@Valid @RequestBody AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    authRequest.getEmail(), 
                    authRequest.getPassword()
                )
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            User user = userService.getUserByEmail(authRequest.getEmail());
            
            String token = jwtUtil.generateToken(user.getEmail());
            
            AuthResponse authResponse = new AuthResponse(
                token, 
                user.getEmail(), 
                user.getName(), 
                user.getRole().name()
            );
            
            ApiResponse<AuthResponse> response = ApiResponse.success("Login successful", authResponse);
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            ApiResponse<AuthResponse> response = ApiResponse.error("Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            ApiResponse<AuthResponse> response = ApiResponse.error("Login failed. Please try again.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/test-email")
    public ResponseEntity<?> testEmail() {
        try {
            System.out.println("=== Testing Email Service ===");
            System.out.println("Email configuration:");
            System.out.println("- Host: smtp.gmail.com");
            System.out.println("- Port: 587");
            System.out.println("- Username: empsyncofficial@gmail.com");
            System.out.println("- Password provided: " + (System.getProperty("spring.mail.password") != null ? "Yes" : "No"));
            
            emailService.sendApplicationSubmissionEmail("test@example.com", "Test User", "Test Position");
            
            System.out.println("=== Test Email Sent Successfully ===");
            return ResponseEntity.ok(Map.of("message", "Test email sent successfully"));
        } catch (Exception e) {
            System.err.println("=== Email Test Failed ===");
            System.err.println("Error Type: " + e.getClass().getName());
            System.err.println("Error Message: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "error", "Failed to send test email",
                "details", e.getMessage(),
                "type", e.getClass().getSimpleName()
            ));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Email is required"
                ));
            }
            
            // Check if user exists
            User user = userService.getUserByEmail(email);
            
            // Generate reset token (simple implementation)
            String resetToken = "RESET-" + System.currentTimeMillis() + "-" + email.hashCode();
            
            // Send password reset email only if user exists
            if (user != null) {
                String[] names = user.getName().split(" ", 2);
                String firstName = names.length > 0 ? names[0] : "User";
                
                // For now, send a simple email (we'll improve this later)
                emailService.sendWelcomeEmail(email, firstName, ""); // Reuse welcome email for now
                
                System.out.println("Password reset email sent to: " + email);
                System.out.println("Reset token: " + resetToken);
            } else {
                System.out.println("Password reset requested for non-existent email: " + email);
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "If an account exists with this email, a reset link has been sent",
                "email", email
            ));
            
        } catch (Exception e) {
            // Always return success to prevent email enumeration attacks
            System.err.println("Error in forgot password: " + e.getMessage());
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "If an account exists with this email, a reset link has been sent"
            ));
        }
    }
}
