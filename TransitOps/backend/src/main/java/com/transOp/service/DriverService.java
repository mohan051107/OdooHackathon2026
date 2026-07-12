package com.transOp.service;

import com.transOp.entity.Driver;
import com.transOp.repository.DriverRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DriverService {
    
    private final DriverRepository driverRepository = null;
    
    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }
    
    public Driver getDriverById(Long id) {
        return driverRepository.findById(id).orElse(null);
    }
    
    public List<Driver> getDriversByStatus(String status) {
        return driverRepository.findByStatus(status);
    }
    
    public List<Driver> getAvailableDrivers() {
        return driverRepository.findByStatus("AVAILABLE");
    }
    
    public List<Driver> getDriversWithExpiredLicenses() {
        return driverRepository.findByLicenseExpiryDateBefore(LocalDate.now());
    }
    
    public Driver createDriver(Driver driver) {
        if (driverRepository.existsByLicenseNumber(driver.getLicenseNumber())) {
            throw new RuntimeException("Driver with license number already exists");
        }
        if (driver.getStatus() == null) {
            driver.setStatus("AVAILABLE");
        }
        if (driver.getSafetyScore() == null) {
            driver.setSafetyScore(100.0);
        }
        return driverRepository.save(driver);
    }
    
    public Driver updateDriver(Long id, Driver driverDetails) {
        Driver driver = getDriverById(id);
        if (driver == null) {
            return null;
        }
        driver.setName(driverDetails.getName());
        driver.setLicenseNumber(driverDetails.getLicenseNumber());
        driver.setLicenseCategory(driverDetails.getLicenseCategory());
        driver.setLicenseExpiryDate(driverDetails.getLicenseExpiryDate());
        driver.setContactNumber(driverDetails.getContactNumber());
        driver.setSafetyScore(driverDetails.getSafetyScore());
        driver.setStatus(driverDetails.getStatus());
        return driverRepository.save(driver);
    }
    
    public void deleteDriver(Long id) {
        driverRepository.deleteById(id);
    }
}