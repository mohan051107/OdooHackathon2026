package com.transOp.service;


import com.transOp.entity.Driver;
import com.transOp.entity.Trip;
import com.transOp.entity.Vehicle;
import com.transOp.repository.DriverRepository;
import com.transOp.repository.TripRepository;
import com.transOp.repository.VehicleRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TripService {
    
    private final TripRepository tripRepository = null;
    
    private final VehicleRepository vehicleRepository = null;
    
    private final DriverRepository driverRepository = null;
    
    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }
    
    public Trip getTripById(Long id) {
        return tripRepository.findById(id).orElse(null);
    }
    
    public List<Trip> getTripsByStatus(String status) {
        return tripRepository.findByStatus(status);
    }
    
    @Transactional
    public Trip createTrip(Trip trip) throws Exception {
        // Validate vehicle
        Vehicle vehicle = vehicleRepository.findById(trip.getVehicle().getId())
            .orElseThrow(() -> new Exception("Vehicle not found"));
        
        // Validate driver
        Driver driver = driverRepository.findById(((Driver) trip.getDriver()).getId())
            .orElseThrow(() -> new Exception("Driver not found"));
        
        // Business Rule: Vehicle must be available
        if (!"AVAILABLE".equals(vehicle.getStatus())) {
            throw new Exception("Vehicle is not available. Current status: " + vehicle.getStatus());
        }
        
        // Business Rule: Driver must be available
        if (!"AVAILABLE".equals(driver.getStatus())) {
            throw new Exception("Driver is not available. Current status: " + driver.getStatus());
        }
        
        // Business Rule: Driver license must be valid
        if (driver.getLicenseExpiryDate().isBefore(LocalDateTime.now().toLocalDate())) {
            throw new Exception("Driver license has expired on " + driver.getLicenseExpiryDate());
        }
        
        // Business Rule: Cargo weight must not exceed vehicle capacity
        if (trip.getCargoWeight() > vehicle.getMaxLoadCapacity()) {
            throw new Exception("Cargo weight (" + trip.getCargoWeight() + " kg) exceeds vehicle capacity (" + 
                              vehicle.getMaxLoadCapacity() + " kg)");
        }
        
        trip.setVehicle(vehicle);
        trip.setDriver(driver);
        trip.setStatus("DRAFT");
        trip.setStartTime(LocalDateTime.now());
        
        return tripRepository.save(trip);
    }
    
    @Transactional
    public Trip dispatchTrip(Long tripId) throws Exception {
        Trip trip = getTripById(tripId);
        if (trip == null) {
            throw new Exception("Trip not found");
        }
        
        if (!"DRAFT".equals(trip.getStatus())) {
            throw new Exception("Only DRAFT trips can be dispatched");
        }
        
        // Update vehicle status to ON_TRIP
        Vehicle vehicle = trip.getVehicle();
        vehicle.setStatus("ON_TRIP");
        vehicleRepository.save(vehicle);
        
        // Update driver status to ON_TRIP
        Driver driver = (Driver) trip.getDriver();
        driver.setStatus("ON_TRIP");
        driverRepository.save(driver);
        
        trip.setStatus("DISPATCHED");
        return tripRepository.save(trip);
    }
    
    @Transactional
    public Trip completeTrip(Long tripId, Double actualDistance, Double fuelConsumed) throws Exception {
        Trip trip = getTripById(tripId);
        if (trip == null) {
            throw new Exception("Trip not found");
        }
        
        if (!"DISPATCHED".equals(trip.getStatus())) {
            throw new Exception("Only DISPATCHED trips can be completed");
        }
        
        trip.setActualDistance(actualDistance);
        trip.setFuelConsumed(fuelConsumed);
        trip.setStatus("COMPLETED");
        trip.setEndTime(LocalDateTime.now());
        
        // Update vehicle back to AVAILABLE
        Vehicle vehicle = trip.getVehicle();
        vehicle.setStatus("AVAILABLE");
        if (actualDistance != null) {
            vehicle.setOdometer((vehicle.getOdometer() != null ? vehicle.getOdometer() : 0) + actualDistance);
        }
        vehicleRepository.save(vehicle);
        
        // Update driver back to AVAILABLE
        Driver driver = (Driver) trip.getDriver();
        driver.setStatus("AVAILABLE");
        driverRepository.save(driver);
        
        return tripRepository.save(trip);
    }
    
    @Transactional
    public Trip cancelTrip(Long tripId) throws Exception {
        Trip trip = getTripById(tripId);
        if (trip == null) {
            throw new Exception("Trip not found");
        }
        
        if ("COMPLETED".equals(trip.getStatus())) {
            throw new Exception("Completed trips cannot be cancelled");
        }
        
        // If trip was dispatched, restore vehicle and driver
        if ("DISPATCHED".equals(trip.getStatus())) {
            Vehicle vehicle = trip.getVehicle();
            vehicle.setStatus("AVAILABLE");
            vehicleRepository.save(vehicle);
            
            Driver driver = (Driver) trip.getDriver();
            driver.setStatus("AVAILABLE");
            driverRepository.save(driver);
        }
        
        trip.setStatus("CANCELLED");
        return tripRepository.save(trip);
    }
    
    public Trip updateTrip(Long id, Trip tripDetails) throws Exception {
        Trip trip = getTripById(id);
        if (trip == null) {
            return null;
        }
        
        // Only allow updates if trip is in DRAFT status
        if (!"DRAFT".equals(trip.getStatus())) {
            throw new Exception("Cannot update trip that is not in DRAFT status");
        }
        
        trip.setSource(tripDetails.getSource());
        trip.setDestination(tripDetails.getDestination());
        trip.setCargoWeight(tripDetails.getCargoWeight());
        trip.setPlannedDistance(tripDetails.getPlannedDistance());
        
        return tripRepository.save(trip);
    }
    
    public void deleteTrip(Long id) throws Exception {
        Trip trip = getTripById(id);
        if (trip == null) {
            throw new Exception("Trip not found");
        }
        
        // Only allow deletion if trip is in DRAFT or CANCELLED status
        if (!"DRAFT".equals(trip.getStatus()) && !"CANCELLED".equals(trip.getStatus())) {
            throw new Exception("Cannot delete trip that is " + trip.getStatus());
        }
        
        tripRepository.deleteById(id);
    }
}