package com.transOp.controller;

import com.transOp.entity.Trip;
import com.transOp.service.TripService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/trips")
@CrossOrigin(origins = "*")
public class TripController {
    
    private final TripService tripService = new TripService();
    
    /**
     * Get all trips
     * @return List of all trips
     */
    @GetMapping
    public ResponseEntity<List<Trip>> getAllTrips() {
        return ResponseEntity.ok(tripService.getAllTrips());
    }
    
    /**
     * Get trip by ID
     * @param id Trip ID
     * @return Trip object
     */
    @GetMapping("/{id}")
    public ResponseEntity<Trip> getTripById(@PathVariable Long id) {
        Trip trip = tripService.getTripById(id);
        if (trip == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(trip);
    }
    
    /**
     * Get trips by status
     * @param status Trip status (DRAFT, DISPATCHED, COMPLETED, CANCELLED)
     * @return List of trips with given status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Trip>> getTripsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(tripService.getTripsByStatus(status));
    }
    
    /**
     * Create a new trip
     * @param trip Trip object
     * @return Created trip
     */
    @PostMapping
    public ResponseEntity<?> createTrip(@RequestBody Trip trip) {
        try {
            Trip created = tripService.createTrip(trip);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * Dispatch a trip (changes vehicle and driver status to ON_TRIP)
     * @param id Trip ID
     * @return Updated trip
     */
    @PutMapping("/{id}/dispatch")
    public ResponseEntity<?> dispatchTrip(@PathVariable Long id) {
        try {
            Trip trip = tripService.dispatchTrip(id);
            return ResponseEntity.ok(trip);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * Complete a trip (changes vehicle and driver status back to AVAILABLE)
     * @param id Trip ID
     * @param actualDistance Actual distance traveled
     * @param fuelConsumed Fuel consumed during trip
     * @return Updated trip
     */
    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeTrip(
            @PathVariable Long id,
            @RequestParam Double actualDistance,
            @RequestParam Double fuelConsumed) {
        try {
            Trip trip = tripService.completeTrip(id, actualDistance, fuelConsumed);
            return ResponseEntity.ok(trip);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * Cancel a trip (restores vehicle and driver if dispatched)
     * @param id Trip ID
     * @return Updated trip
     */
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelTrip(@PathVariable Long id) {
        try {
            Trip trip = tripService.cancelTrip(id);
            return ResponseEntity.ok(trip);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * Update trip details
     * @param id Trip ID
     * @param trip Updated trip details
     * @return Updated trip
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTrip(@PathVariable Long id, @RequestBody Trip trip) {
        try {
            Trip updated = tripService.updateTrip(id, trip);
            if (updated == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * Delete a trip
     * @param id Trip ID
     * @return No content response
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrip(@PathVariable Long id) {
        try {
            tripService.deleteTrip(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}