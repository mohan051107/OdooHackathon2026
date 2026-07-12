package com.transOp.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

// Explicit imports for entities
import com.transOp.entity.Vehicle;
import com.transOp.entity.Driver;

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
    private Vehicle vehicle;        // Must be com.transOp.entity.Vehicle

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;          // Must be com.transOp.entity.Driver

    @Column(nullable = false)
    private String status;

    // Constructors, getters, setters...
    // (your existing code)
}