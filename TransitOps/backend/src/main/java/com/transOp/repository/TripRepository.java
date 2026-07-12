package com.transOp.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.transOp.entity.Trip;

import java.time.LocalDateTime;
import java.util.List;



public interface TripRepository extends JpaRepository<Trip, Long> {
    
    /**
     * Find all trips with a specific status
     * @param status Trip status (DRAFT, DISPATCHED, COMPLETED, CANCELLED)
     * @return List of trips with given status
     */
    List<Trip> findByStatus(String status);
    
    /**
     * Find all trips for a specific vehicle
     * @param vehicleId Vehicle ID
     * @return List of trips for the vehicle
     */
    List<Trip> findByVehicleId(Long vehicleId);
    
    /**
     * Find all trips for a specific driver
     * @param driverId Driver ID
     * @return List of trips for the driver
     */
    List<Trip> findByDriverId(Long driverId);
    
    /**
     * Find trips by status and vehicle ID
     * @param status Trip status
     * @param vehicleId Vehicle ID
     * @return List of trips matching criteria
     */
    List<Trip> findByStatusAndVehicleId(String status, Long vehicleId);
    
    /**
     * Find trips by status and driver ID
     * @param status Trip status
     * @param driverId Driver ID
     * @return List of trips matching criteria
     */
    List<Trip> findByStatusAndDriverId(String status, Long driverId);
    
    /**
     * Find trips between two dates
     * @param startDate Start date
     * @param endDate End date
     * @return List of trips in date range
     */
    List<Trip> findByStartTimeBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Find trips completed between two dates
     * @param startDate Start date
     * @param endDate End date
     * @return List of completed trips in date range
     */
    List<Trip> findByEndTimeBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Find trips with cargo weight greater than specified value
     * @param weight Minimum cargo weight
     * @return List of trips with cargo weight > weight
     */
    List<Trip> findByCargoWeightGreaterThan(Double weight);
    
    /**
     * Find trips with cargo weight less than specified value
     * @param weight Maximum cargo weight
     * @return List of trips with cargo weight < weight
     */
    List<Trip> findByCargoWeightLessThan(Double weight);
    
    /**
     * Find trips by source and destination
     * @param source Source location
     * @param destination Destination location
     * @return List of trips matching route
     */
    List<Trip> findBySourceAndDestination(String source, String destination);
    
    /**
     * Find trips by source containing search term
     * @param source Search term
     * @return List of trips with source containing search term
     */
    List<Trip> findBySourceContainingIgnoreCase(String source);
    
    /**
     * Find trips by destination containing search term
     * @param destination Search term
     * @return List of trips with destination containing search term
     */
    List<Trip> findByDestinationContainingIgnoreCase(String destination);
    
    /**
     * Get active trips (DISPATCHED status)
     * @return List of active trips
     */
    @Query("SELECT t FROM Trip t WHERE t.status = 'DISPATCHED'")
    List<Trip> findActiveTrips();
    
    /**
     * Get pending trips (DRAFT status)
     * @return List of pending trips
     */
    @Query("SELECT t FROM Trip t WHERE t.status = 'DRAFT'")
    List<Trip> findPendingTrips();
    
    /**
     * Count trips by status
     * @param status Trip status
     * @return Count of trips with given status
     */
    long countByStatus(String status);
    
    /**
     * Count trips for a vehicle by status
     * @param vehicleId Vehicle ID
     * @param status Trip status
     * @return Count of trips matching criteria
     */
    long countByVehicleIdAndStatus(Long vehicleId, String status);
    
    /**
     * Count trips for a driver by status
     * @param driverId Driver ID
     * @param status Trip status
     * @return Count of trips matching criteria
     */
    long countByDriverIdAndStatus(Long driverId, String status);
    
    /**
     * Get total distance traveled by a vehicle
     * @param vehicleId Vehicle ID
     * @return Total actual distance
     */
    @Query("SELECT COALESCE(SUM(t.actualDistance), 0) FROM Trip t WHERE t.vehicle.id = :vehicleId AND t.status = 'COMPLETED'")
    Double getTotalDistanceByVehicleId(@Param("vehicleId") Long vehicleId);
    
    /**
     * Get total fuel consumed by a vehicle
     * @param vehicleId Vehicle ID
     * @return Total fuel consumed
     */
    @Query("SELECT COALESCE(SUM(t.fuelConsumed), 0) FROM Trip t WHERE t.vehicle.id = :vehicleId AND t.status = 'COMPLETED'")
    Double getTotalFuelByVehicleId(@Param("vehicleId") Long vehicleId);
    
    /**
     * Get average fuel efficiency for a vehicle
     * @param vehicleId Vehicle ID
     * @return Average fuel efficiency (distance per liter)
     */
    @Query("SELECT COALESCE(SUM(t.actualDistance) / NULLIF(SUM(t.fuelConsumed), 0), 0) FROM Trip t WHERE t.vehicle.id = :vehicleId AND t.status = 'COMPLETED'")
    Double getAverageFuelEfficiency(@Param("vehicleId") Long vehicleId);
    
    /**
     * Update trip status
     * @param id Trip ID
     * @param status New status
     * @return Number of rows affected
     */
    @Modifying
    @Query("UPDATE Trip t SET t.status = :status WHERE t.id = :id")
    int updateTripStatus(@Param("id") Long id, @Param("status") String status);
    
    /**
     * Get latest trips (most recent first)
     * @return List of latest trips
     */
    @Query("SELECT t FROM Trip t ORDER BY t.startTime DESC")
    List<Trip> findLatestTrips();
    
    /**
     * Get trips by vehicle and date range
     * @param vehicleId Vehicle ID
     * @param startDate Start date
     * @param endDate End date
     * @return List of trips matching criteria
     */
    @Query("SELECT t FROM Trip t WHERE t.vehicle.id = :vehicleId AND t.startTime BETWEEN :startDate AND :endDate")
    List<Trip> findByVehicleIdAndDateRange(@Param("vehicleId") Long vehicleId, 
                                           @Param("startDate") LocalDateTime startDate, 
                                           @Param("endDate") LocalDateTime endDate);
    
    /**
     * Get trips by driver and date range
     * @param driverId Driver ID
     * @param startDate Start date
     * @param endDate End date
     * @return List of trips matching criteria
     */
    @Query("SELECT t FROM Trip t WHERE t.driver.id = :driverId AND t.startTime BETWEEN :startDate AND :endDate")
    List<Trip> findByDriverIdAndDateRange(@Param("driverId") Long driverId, 
                                          @Param("startDate") LocalDateTime startDate, 
                                          @Param("endDate") LocalDateTime endDate);
    
    /**
     * Get completed trips count for a vehicle
     * @param vehicleId Vehicle ID
     * @return Count of completed trips
     */
    @Query("SELECT COUNT(t) FROM Trip t WHERE t.vehicle.id = :vehicleId AND t.status = 'COMPLETED'")
    long countCompletedTripsByVehicleId(@Param("vehicleId") Long vehicleId);
    
    /**
     * Get completed trips count for a driver
     * @param driverId Driver ID
     * @return Count of completed trips
     */
    @Query("SELECT COUNT(t) FROM Trip t WHERE t.driver.id = :driverId AND t.status = 'COMPLETED'")
    long countCompletedTripsByDriverId(@Param("driverId") Long driverId);
    
    /**
     * Check if vehicle is currently on a trip (DISPATCHED status)
     * @param vehicleId Vehicle ID
     * @return true if vehicle is on a trip
     */
    @Query("SELECT COUNT(t) > 0 FROM Trip t WHERE t.vehicle.id = :vehicleId AND t.status = 'DISPATCHED'")
    boolean isVehicleOnTrip(@Param("vehicleId") Long vehicleId);
    
    /**
     * Check if driver is currently on a trip (DISPATCHED status)
     * @param driverId Driver ID
     * @return true if driver is on a trip
     */
    @Query("SELECT COUNT(t) > 0 FROM Trip t WHERE t.driver.id = :driverId AND t.status = 'DISPATCHED'")
    boolean isDriverOnTrip(@Param("driverId") Long driverId);
}