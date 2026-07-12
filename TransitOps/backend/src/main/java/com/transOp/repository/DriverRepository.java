package com.transOp.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.transOp.entity.Driver;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DriverRepository extends JpaRepository<Driver, Long> {
    
    /**
     * Find driver by license number
     * @param licenseNumber Driver's license number
     * @return Optional containing the driver if found
     */
    Optional<Driver> findByLicenseNumber(String licenseNumber);
    
    /**
     * Check if a driver with given license number exists
     * @param licenseNumber Driver's license number
     * @return true if exists, false otherwise
     */
    boolean existsByLicenseNumber(String licenseNumber);
    
    /**
     * Find all drivers with a specific status
     * @param status Driver status (AVAILABLE, ON_TRIP, OFF_DUTY, SUSPENDED)
     * @return List of drivers with given status
     */
    List<Driver> findByStatus(String status);
    
    /**
     * Find all drivers whose license has expired
     * @param date Current date
     * @return List of drivers with expired licenses
     */
    List<Driver> findByLicenseExpiryDateBefore(LocalDate date);
    
    /**
     * Find all drivers with license expiry date between two dates
     * @param startDate Start date
     * @param endDate End date
     * @return List of drivers with licenses expiring in date range
     */
    List<Driver> findByLicenseExpiryDateBetween(LocalDate startDate, LocalDate endDate);
    
    /**
     * Find drivers with safety score above threshold
     * @param minScore Minimum safety score
     * @return List of drivers with safety score >= minScore
     */
    List<Driver> findBySafetyScoreGreaterThanEqual(Double minScore);
    
    /**
     * Find drivers with safety score below threshold
     * @param maxScore Maximum safety score
     * @return List of drivers with safety score <= maxScore
     */
    List<Driver> findBySafetyScoreLessThanEqual(Double maxScore);
    
    /**
     * Find drivers by name containing search term (case insensitive)
     * @param name Search term
     * @return List of drivers matching the name
     */
    List<Driver> findByNameContainingIgnoreCase(String name);
    
    /**
     * Find available drivers with valid licenses
     * @param status Status to check (AVAILABLE)
     * @param date Current date
     * @return List of available drivers with valid licenses
     */
    @Query("SELECT d FROM Driver d WHERE d.status = :status AND d.licenseExpiryDate >= :date")
    List<Driver> findAvailableDriversWithValidLicense(@Param("status") String status, @Param("date") LocalDate date);
    
    /**
     * Count drivers by status
     * @param status Driver status
     * @return Count of drivers with given status
     */
    long countByStatus(String status);
    
    /**
     * Find drivers with upcoming license expiry (next 30 days)
     * @param date Current date
     * @param days Number of days ahead to check
     * @return List of drivers with licenses expiring soon
     */
    @Query("SELECT d FROM Driver d WHERE d.licenseExpiryDate BETWEEN :date AND :date + :days")
    List<Driver> findDriversWithUpcomingExpiry(@Param("date") LocalDate date, @Param("days") int days);
    
    /**
     * Find all drivers sorted by safety score (descending)
     * @return List of drivers sorted by safety score
     */
    @Query("SELECT d FROM Driver d ORDER BY d.safetyScore DESC")
    List<Driver> findAllOrderBySafetyScoreDesc();
}