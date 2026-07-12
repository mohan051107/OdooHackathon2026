package com.transOp.entity;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "drivers")
public class Driver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(name = "license_number", unique = true)
    private String licenseNumber;
    
    @Column(name = "license_category")
    private String licenseCategory;
    
    @Column(name = "license_expiry_date")
    private LocalDate licenseExpiryDate;
    
    @Column(name = "contact_number")
    private String contactNumber;
    
    @Column(name = "safety_score")
    private Double safetyScore = 100.0;
    
    @Column(nullable = false)
    private String status; // AVAILABLE, ON_TRIP, OFF_DUTY, SUSPENDED
    
    // Constructors
    public Driver() {}
    
    public Driver(String name, String licenseNumber, String licenseCategory, LocalDate licenseExpiryDate, String status) {
        this.name = name;
        this.licenseNumber = licenseNumber;
        this.licenseCategory = licenseCategory;
        this.licenseExpiryDate = licenseExpiryDate;
        this.status = status;
        this.safetyScore = 100.0;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getLicenseNumber() {
        return licenseNumber;
    }
    
    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }
    
    public String getLicenseCategory() {
        return licenseCategory;
    }
    
    public void setLicenseCategory(String licenseCategory) {
        this.licenseCategory = licenseCategory;
    }
    
    public LocalDate getLicenseExpiryDate() {
        return licenseExpiryDate;
    }
    
    public void setLicenseExpiryDate(LocalDate licenseExpiryDate) {
        this.licenseExpiryDate = licenseExpiryDate;
    }
    
    public String getContactNumber() {
        return contactNumber;
    }
    
    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }
    
    public Double getSafetyScore() {
        return safetyScore;
    }
    
    public void setSafetyScore(Double safetyScore) {
        this.safetyScore = safetyScore;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    // Helper methods
    public boolean isAvailable() {
        return "AVAILABLE".equals(this.status);
    }
    
    public boolean isOnTrip() {
        return "ON_TRIP".equals(this.status);
    }
    
    public boolean isOffDuty() {
        return "OFF_DUTY".equals(this.status);
    }
    
    public boolean isSuspended() {
        return "SUSPENDED".equals(this.status);
    }
    
    public boolean hasValidLicense() {
        return this.licenseExpiryDate != null && 
               this.licenseExpiryDate.isAfter(LocalDate.now());
    }
    
    @Override
    public String toString() {
        return "Driver{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", licenseNumber='" + licenseNumber + '\'' +
                ", licenseCategory='" + licenseCategory + '\'' +
                ", licenseExpiryDate=" + licenseExpiryDate +
                ", safetyScore=" + safetyScore +
                ", status='" + status + '\'' +
                '}';
    }
}