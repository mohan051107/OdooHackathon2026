package com.transOp.entity;

import javax.persistence.*;

@Entity
@Table(name = "vehicles")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String registrationNumber;

    private String name;
    private String type;
    private Double maxLoadCapacity;
    private Double odometer;
    private Double acquisitionCost;
    private String status; // AVAILABLE, ON_TRIP, IN_SHOP, RETIRED

    public Vehicle() {}

    public Vehicle(String registrationNumber, String name, String type, Double maxLoadCapacity, String status) {
        this.registrationNumber = registrationNumber;
        this.name = name;
        this.type = type;
        this.maxLoadCapacity = maxLoadCapacity;
        this.status = status;
        this.odometer = 0.0;
        this.acquisitionCost = 0.0;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Double getMaxLoadCapacity() { return maxLoadCapacity; }
    public void setMaxLoadCapacity(Double maxLoadCapacity) { this.maxLoadCapacity = maxLoadCapacity; }

    public Double getOdometer() { return odometer; }
    public void setOdometer(Double odometer) { this.odometer = odometer; }

    public Double getAcquisitionCost() { return acquisitionCost; }
    public void setAcquisitionCost(Double acquisitionCost) { this.acquisitionCost = acquisitionCost; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    // Helper methods
    public boolean isAvailable() { return "AVAILABLE".equals(status); }
    public boolean isOnTrip() { return "ON_TRIP".equals(status); }
    public boolean isInShop() { return "IN_SHOP".equals(status); }
    public boolean isRetired() { return "RETIRED".equals(status); }
}