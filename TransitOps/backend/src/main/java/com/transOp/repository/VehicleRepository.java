package com.transOp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.transOp.entity.Vehicle;

import java.util.List;
import java.util.Optional;


public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    
    /**
     * Find vehicle by registration number
     * @param registrationNumber Vehicle registration number
     * @return Optional containing the vehicle if found
     */
    Optional<Vehicle> findByRegistrationNumber(String registrationNumber);
    
    /**
     * Check if a vehicle with given registration number exists
     * @param registrationNumber Vehicle registration number
     * @return true if exists, false otherwise
     */
    boolean existsByRegistrationNumber(String registrationNumber);
    
    /**
     * Find all vehicles with a specific status
     * @param status Vehicle status (AVAILABLE, ON_TRIP, IN_SHOP, RETIRED)
     * @return List of vehicles with given status
     */
    List<Vehicle> findByStatus(String status);
    
    /**
     * Find vehicles with status NOT IN the given list
     * @param statuses List of statuses to exclude
     * @return List of vehicles not in given statuses
     */
    List<Vehicle> findByStatusNotIn(List<String> statuses);
    
    /**
     * Find vehicles with type matching the given type
     * @param type Vehicle type
     * @return List of vehicles with given type
     */
    List<Vehicle> findByType(String type);
    
    /**
     * Find vehicles with max load capacity greater than specified value
     * @param capacity Minimum load capacity
     * @return List of vehicles with capacity >= capacity
     */
    List<Vehicle> findByMaxLoadCapacityGreaterThanEqual(Double capacity);
    
    /**
     * Find vehicles by name containing search term (case insensitive)
     * @param name Search term
     * @return List of vehicles matching the name
     */
    List<Vehicle> findByNameContainingIgnoreCase(String name);
    
    /**
     * Get available vehicles (AVAILABLE status)
     * @return List of available vehicles
     */
    @Query("SELECT v FROM Vehicle v WHERE v.status = 'AVAILABLE'")
    List<Vehicle> findAvailableVehicles();
    
    /**
     * Get vehicles on trip (ON_TRIP status)
     * @return List of vehicles on trip
     */
    @Query("SELECT v FROM Vehicle v WHERE v.status = 'ON_TRIP'")
    List<Vehicle> findVehiclesOnTrip();
    
    /**
     * Get vehicles in maintenance (IN_SHOP status)
     * @return List of vehicles in maintenance
     */
    @Query("SELECT v FROM Vehicle v WHERE v.status = 'IN_SHOP'")
    List<Vehicle> findVehiclesInMaintenance();
    
    /**
     * Count vehicles by status
     * @param status Vehicle status
     * @return Count of vehicles with given status
     */
    long countByStatus(String status);
    
    /**
     * Get vehicles with odometer less than specified value
     * @param odometer Maximum odometer value
     * @return List of vehicles with odometer < value
     */
    List<Vehicle> findByOdometerLessThan(Double odometer);
    
    /**
     * Get vehicles with acquisition cost greater than specified value
     * @param cost Minimum acquisition cost
     * @return List of vehicles with acquisition cost >= cost
     */
    List<Vehicle> findByAcquisitionCostGreaterThanEqual(Double cost);
    
    /**
     * Get available vehicles with capacity for cargo
     * @param cargoWeight Required cargo weight
     * @return List of vehicles that can carry the cargo
     */
    @Query("SELECT v FROM Vehicle v WHERE v.status = 'AVAILABLE' AND v.maxLoadCapacity >= :cargoWeight")
    List<Vehicle> findAvailableVehiclesForCargo(@Param("cargoWeight") Double cargoWeight);
}