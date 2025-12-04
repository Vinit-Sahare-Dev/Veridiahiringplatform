package com.veridia.hiring.controller;

import com.veridia.hiring.dto.AuthRequest;
import com.veridia.hiring.dto.AuthResponse;
import com.veridia.hiring.dto.RegisterRequest;
import com.veridia.hiring.model.Role;
import com.veridia.hiring.model.User;
import com.veridia.hiring.service.UserService;
import com.veridia.hiring.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            User user = userService.registerUser(
                registerRequest.getName(), 
                registerRequest.getEmail(), 
                registerRequest.getPassword(), 
                Role.CANDIDATE
            );
            
            String token = jwtUtil.generateToken(user.getEmail());
            
            AuthResponse response = new AuthResponse(
                token, 
                user.getEmail(), 
                user.getName(), 
                user.getRole().name()
            );
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody AuthRequest authRequest) {
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
            
            AuthResponse response = new AuthResponse(
                token, 
                user.getEmail(), 
                user.getName(), 
                user.getRole().name()
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid email or password");
        }
    }
}
