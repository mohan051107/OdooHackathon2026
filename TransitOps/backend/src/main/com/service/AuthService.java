package com.service;

import com.dto.LoginRequest;
import com.dto.LoginResponse;
import com.entity.User;
import com.repository.UserRepository;
import com.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    /**
     * Login user
     */
    public LoginResponse login(LoginRequest request) {
        // Validate input
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            return new LoginResponse(false, "Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            return new LoginResponse(false, "Password is required");
        }

        // Check if user exists
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        
        if (user == null) {
            // For demo: Create new user automatically
            user = new User(
                request.getEmail(),
                request.getPassword(),
                request.getEmail().split("@")[0],
                "FLEET_MANAGER"
            );
            userRepository.save(user);
        }
        
        // Check password (In production, use password encoder)
        if (!user.getPassword().equals(request.getPassword())) {
            return new LoginResponse(false, "Invalid credentials");
        }
        
        // Check if user is active
        if (!user.isActive()) {
            return new LoginResponse(false, "Account is deactivated");
        }
        
        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail());
        
        // Return success response
        return new LoginResponse(
            true,
            token,
            user.getEmail(),
            user.getFullName(),
            user.getRole()
        );
    }
    
    /**
     * Register new user
     */
    public LoginResponse register(LoginRequest request) {
        // Validate input
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            return new LoginResponse(false, "Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            return new LoginResponse(false, "Password is required");
        }
        if (request.getPassword().length() < 6) {
            return new LoginResponse(false, "Password must be at least 6 characters");
        }
        
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return new LoginResponse(false, "Email already registered");
        }
        
        // Create new user
        User user = new User(
            request.getEmail(),
            request.getPassword(),
            request.getEmail().split("@")[0],
            "FLEET_MANAGER"
        );
        userRepository.save(user);
        
        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail());
        
        // Return success response
        return new LoginResponse(
            true,
            token,
            user.getEmail(),
            user.getFullName(),
            user.getRole()
        );
    }
    
    /**
     * Get user by email
     */
    public LoginResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        
        if (user == null) {
            return new LoginResponse(false, "User not found");
        }
        
        // Generate new token (optional)
        String token = jwtUtil.generateToken(user.getEmail());
        
        return new LoginResponse(
            true,
            token,
            user.getEmail(),
            user.getFullName(),
            user.getRole()
        );
    }
}