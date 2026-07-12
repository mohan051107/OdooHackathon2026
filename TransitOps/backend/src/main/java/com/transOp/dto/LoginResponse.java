package com.transOp.dto;

public class LoginResponse {
    private boolean success;
    private String message;
    private String token;
    private String email;
    private String fullName;
    private String role;

    // Default Constructor
    public LoginResponse() {}

    // Constructor for success response
    public LoginResponse(boolean success, String token, String email, String fullName, String role) {
        this.success = success;
        this.token = token;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.message = "Login successful";
    }

    // Constructor for error response
    public LoginResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @Override
    public String toString() {
        return "LoginResponse{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", token='" + token + '\'' +
                ", email='" + email + '\'' +
                ", fullName='" + fullName + '\'' +
                ", role='" + role + '\'' +
                '}';
    }
}