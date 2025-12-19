package com.veridia.hiring.config;

import com.veridia.hiring.model.Role;
import com.veridia.hiring.model.User;
import com.veridia.hiring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if admin user already exists
        if (!userRepository.existsByEmail("admin@veridia.com")) {
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@veridia.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            
            userRepository.save(admin);
            System.out.println("Default admin user created: admin@veridia.com / admin123");
        }
    }
}
