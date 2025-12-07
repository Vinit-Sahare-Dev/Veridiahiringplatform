package com.veridia.hiring.controller;

import com.veridia.hiring.dto.ApiResponse;
import com.veridia.hiring.dto.AuthRequest;
import com.veridia.hiring.dto.AuthResponse;
import com.veridia.hiring.dto.RegisterRequest;
import com.veridia.hiring.model.Role;
import com.veridia.hiring.model.User;
import com.veridia.hiring.service.UserService;
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

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173,http://localhost:5174")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Map<String, Object>>> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            User user = userService.registerUser(
                registerRequest.getName(), 
                registerRequest.getEmail(), 
                registerRequest.getPassword(), 
                Role.CANDIDATE
            );
            
            Map<String, Object> userData = new HashMap<>();
            userData.put("email", user.getEmail());
            userData.put("name", user.getName());
            userData.put("role", user.getRole().name());
            
            ApiResponse<Map<String, Object>> response = ApiResponse.success("User registered successfully. Please login with your credentials.", userData);
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
}
