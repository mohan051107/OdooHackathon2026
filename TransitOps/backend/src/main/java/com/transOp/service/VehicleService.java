package com.transOp.service;

import com.transOp.entity.Vehicle;
import com.transOp.repository.VehicleRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService {
    
    private final VehicleRepository vehicleRepository = null;
    
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }
    
    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id).orElse(null);
    }
    
    public List<Vehicle> getVehiclesByStatus(String status) {
        return vehicleRepository.findByStatus(status);
    }
    
    public List<Vehicle> getAvailableVehicles() {
        return vehicleRepository.findByStatus("AVAILABLE");
    }
    
    public Vehicle createVehicle(Vehicle vehicle) {
        if (vehicleRepository.existsByRegistrationNumber(vehicle.getRegistrationNumber())) {
            throw new RuntimeException("Vehicle with registration number already exists");
        }
        if (vehicle.getStatus() == null) {
            vehicle.setStatus("AVAILABLE");
        }
        return vehicleRepository.save(vehicle);
    }
    
    public Vehicle updateVehicle(Long id, Vehicle vehicleDetails) {
        Vehicle vehicle = getVehicleById(id);
        if (vehicle == null) {
            return null;
        }
        vehicle.setName(vehicleDetails.getName());
        vehicle.setType(vehicleDetails.getType());
        vehicle.setMaxLoadCapacity(vehicleDetails.getMaxLoadCapacity());
        vehicle.setOdometer(vehicleDetails.getOdometer());
        vehicle.setAcquisitionCost(vehicleDetails.getAcquisitionCost());
        vehicle.setStatus(vehicleDetails.getStatus());
        return vehicleRepository.save(vehicle);
    }
    
    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }
}