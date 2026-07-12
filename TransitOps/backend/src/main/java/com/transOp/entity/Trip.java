package com.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "trips")
public class Trip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String source;
    private String destination;
    
    @Column(name = "cargo_weight")
    private Double cargoWeight;
    
    @Column(name = "planned_distance")
    private Double plannedDistance;
    
    @Column(name = "actual_distance")
    private Double actualDistance;
    
    @Column(name = "fuel_consumed")
    private Double fuelConsumed;
    
    @Column(name = "start_time")
    private LocalDateTime startTime;
    
    @Column(name = "end_time")
    private LocalDateTime endTime;
    
    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;
    
    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;
    
    @Column(nullable = false)
    private String status; // DRAFT, DISPATCHED, COMPLETED, CANCELLED
    
    // Constructors
    public Trip() {}
    
    public Trip(String source, String destination, Double cargoWeight, Double plannedDistance) {
        this.source = source;
        this.destination = destination;
        this.cargoWeight = cargoWeight;
        this.plannedDistance = plannedDistance;
        this.status = "DRAFT";
        this.startTime = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getSource() {
        return source;
    }
    
    public void setSource(String source) {
        this.source = source;
    }
    
    public String getDestination() {
        return destination;
    }
    
    public void setDestination(String destination) {
        this.destination = destination;
    }
    
    public Double getCargoWeight() {
        return cargoWeight;
    }
    
    public void setCargoWeight(Double cargoWeight) {
        this.cargoWeight = cargoWeight;
    }
    
    public Double getPlannedDistance() {
        return plannedDistance;
    }
    
    public void setPlannedDistance(Double plannedDistance) {
        this.plannedDistance = plannedDistance;
    }
    
    public Double getActualDistance() {
        return actualDistance;
    }
    
    public void setActualDistance(Double actualDistance) {
        this.actualDistance = actualDistance;
    }
    
    public Double getFuelConsumed() {
        return fuelConsumed;
    }
    
    public void setFuelConsumed(Double fuelConsumed) {
        this.fuelConsumed = fuelConsumed;
    }
    
    public LocalDateTime getStartTime() {
        return startTime;
    }
    
    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }
    
    public LocalDateTime getEndTime() {
        return endTime;
    }
    
    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
    
    public Vehicle getVehicle() {
        return vehicle;
    }
    
    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }
    
    public Driver getDriver() {
        return driver;
    }
    
    public void setDriver(Driver driver) {
        this.driver = driver;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    // Helper methods
    public boolean isDraft() {
        return "DRAFT".equals(this.status);
    }
    
    public boolean isDispatched() {
        return "DISPATCHED".equals(this.status);
    }
    
    public boolean isCompleted() {
        return "COMPLETED".equals(this.status);
    }
    
    public boolean isCancelled() {
        return "CANCELLED".equals(this.status);
    }
    
    public double getFuelEfficiency() {
        if (this.actualDistance != null && this.fuelConsumed != null && this.fuelConsumed > 0) {
            return this.actualDistance / this.fuelConsumed;
        }
        return 0.0;
    }
    
    public double getOperationalCost() {
        // This is a placeholder - actual cost calculation would include more factors
        if (this.fuelConsumed != null) {
            // Assuming average fuel price of $2.50 per liter
            return this.fuelConsumed * 2.50;
        }
        return 0.0;
    }
    
    @Override
    public String toString() {
        return "Trip{" +
                "id=" + id +
                ", source='" + source + '\'' +
                ", destination='" + destination + '\'' +
                ", cargoWeight=" + cargoWeight +
                ", status='" + status + '\'' +
                ", vehicle=" + (vehicle != null ? vehicle.getRegistrationNumber() : "null") +
                ", driver=" + (driver != null ? driver.getName() : "null") +
                '}';
    }
}