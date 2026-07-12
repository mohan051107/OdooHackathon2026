package com.transOp.controller;

import com.transOp.entity.Vehicle;
import com.transOp.service.VehicleService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vehicles")
@CrossOrigin(origins = "*")
public class VehicleController {
    
    private final VehicleService vehicleService = new VehicleService();
    
    /**
     * Get all vehicles
     * @return List of all vehicles
     */
    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }
    
    /**
     * Get vehicle by ID
     * @param id Vehicle ID
     * @return Vehicle object
     */
    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable Long id) {
        Vehicle vehicle = vehicleService.getVehicleById(id);
        if (vehicle == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(vehicle);
    }
    
    /**
     * Get vehicles by status
     * @param status Vehicle status (AVAILABLE, ON_TRIP, IN_SHOP, RETIRED)
     * @return List of vehicles with given status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Vehicle>> getVehiclesByStatus(@PathVariable String status) {
        return ResponseEntity.ok(vehicleService.getVehiclesByStatus(status));
    }
    
    /**
     * Get available vehicles (for dispatch selection)
     * @return List of available vehicles
     */
    @GetMapping("/available")
    public ResponseEntity<List<Vehicle>> getAvailableVehicles() {
        return ResponseEntity.ok(vehicleService.getAvailableVehicles());
    }
    
    /**
     * Create a new vehicle
     * @param vehicle Vehicle object
     * @return Created vehicle
     */
    @PostMapping
    public ResponseEntity<?> createVehicle(@RequestBody Vehicle vehicle) {
        try {
            Vehicle created = vehicleService.createVehicle(vehicle);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * Update an existing vehicle
     * @param id Vehicle ID
     * @param vehicle Updated vehicle details
     * @return Updated vehicle
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateVehicle(@PathVariable Long id, @RequestBody Vehicle vehicle) {
        try {
            Vehicle updated = vehicleService.updateVehicle(id, vehicle);
            if (updated == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * Delete a vehicle
     * @param id Vehicle ID
     * @return No content response
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVehicle(@PathVariable Long id) {
        try {
            vehicleService.deleteVehicle(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}