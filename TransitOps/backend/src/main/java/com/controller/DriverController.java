package com.controller;

import com.entity.Driver;
import com.service.DriverService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/drivers")
@CrossOrigin(origins = "*")
public class DriverController {
    
    private final DriverService driverService = new DriverService();
    
    /**
     * Get all drivers
     * @return List of all drivers
     */
    @GetMapping
    public ResponseEntity<List<Driver>> getAllDrivers() {
        return ResponseEntity.ok(driverService.getAllDrivers());
    }
    
    /**
     * Get driver by ID
     * @param id Driver ID
     * @return Driver object
     */
    @GetMapping("/{id}")
    public ResponseEntity<Driver> getDriverById(@PathVariable Long id) {
        Driver driver = driverService.getDriverById(id);
        if (driver == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(driver);
    }
    
    /**
     * Get drivers by status
     * @param status Driver status (AVAILABLE, ON_TRIP, OFF_DUTY, SUSPENDED)
     * @return List of drivers with given status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Driver>> getDriversByStatus(@PathVariable String status) {
        return ResponseEntity.ok(driverService.getDriversByStatus(status));
    }
    
    /**
     * Get available drivers (for dispatch selection)
     * @return List of available drivers
     */
    @GetMapping("/available")
    public ResponseEntity<List<Driver>> getAvailableDrivers() {
        return ResponseEntity.ok(driverService.getAvailableDrivers());
    }
    
    /**
     * Get drivers with expired licenses
     * @return List of drivers with expired licenses
     */
    @GetMapping("/expired-licenses")
    public ResponseEntity<List<Driver>> getDriversWithExpiredLicenses() {
        return ResponseEntity.ok(driverService.getDriversWithExpiredLicenses());
    }
    
    /**
     * Create a new driver
     * @param driver Driver object
     * @return Created driver
     */
    @PostMapping
    public ResponseEntity<?> createDriver(@RequestBody Driver driver) {
        try {
            Driver created = driverService.createDriver(driver);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * Update an existing driver
     * @param id Driver ID
     * @param driver Updated driver details
     * @return Updated driver
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDriver(@PathVariable Long id, @RequestBody Driver driver) {
        try {
            Driver updated = driverService.updateDriver(id, driver);
            if (updated == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * Delete a driver
     * @param id Driver ID
     * @return No content response
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDriver(@PathVariable Long id) {
        try {
            driverService.deleteDriver(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}