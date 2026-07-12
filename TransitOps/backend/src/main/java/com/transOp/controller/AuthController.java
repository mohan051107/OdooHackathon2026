package com.transOp.controller;

import com.transOp.dto.LoginRequest;
import com.transOp.dto.LoginResponse;
import com.transOp.service.AuthService;
import com.transOp.util.JwtUtil;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    private final AuthService authService;
    
    private final JwtUtil jwtUtil;

    AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }
    
    /**
     * Login endpoint - Authenticates user and returns JWT token
     * @param request LoginRequest containing email and password
     * @return LoginResponse with user details and token
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
    
    /**
     * Validate JWT token endpoint
     * @param authHeader Authorization header containing Bearer token
     * @return Boolean indicating if token is valid
     */
    @GetMapping("/validate")
    public ResponseEntity<Boolean> validateToken(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            boolean isValid = jwtUtil.validateToken(token);
            return ResponseEntity.ok(isValid);
        }
        return ResponseEntity.ok(false);
    }
    
    /**
     * Get current user info from token
     * @param authHeader Authorization header containing Bearer token
     * @return LoginResponse with user details
     */
    @GetMapping("/me")
    public ResponseEntity<LoginResponse> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            
            if (jwtUtil.validateToken(token)) {
                String email = jwtUtil.getEmailFromToken(token);
                
                // Fetch user details from service
                LoginResponse response = authService.getUserByEmail(email);
                if (response != null && response.isSuccess()) {
                    return ResponseEntity.ok(response);
                }
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new LoginResponse(false, "User not found"));
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new LoginResponse(false, "Invalid or expired token"));
    }
    
    /**
     * Logout endpoint - Client side should remove token
     * @return Success message
     */
    @PostMapping("/logout")
    public ResponseEntity<LoginResponse> logout() {
        // JWT is stateless, so logout is handled on client side
        // This endpoint exists for completeness
        return ResponseEntity.ok(new LoginResponse(true, "Logout successful"));
    }
    
    /**
     * Register new user endpoint
     * @param request LoginRequest containing email and password
     * @return LoginResponse with user details and token
     */
    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@RequestBody LoginRequest request) {
        LoginResponse response = authService.register(request);
        
        if (response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}