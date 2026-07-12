package com.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@Component
public class DatabaseUtil {
    
    @Autowired
    private DataSource dataSource;
    
    /**
     * Get a database connection
     * @return Connection object
     * @throws SQLException if connection fails
     */
    public Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }
    
    /**
     * Check if database connection is active
     * @return true if connected, false otherwise
     */
    public boolean isConnected() {
        try (Connection conn = getConnection()) {
            return conn != null && !conn.isClosed();
        } catch (SQLException e) {
            return false;
        }
    }
    
    /**
     * Get database connection status message
     * @return Status message
     */
    public String getConnectionStatus() {
        try (Connection conn = getConnection()) {
            if (conn != null && !conn.isClosed()) {
                return "Database connected successfully!";
            }
            return "Database connection failed!";
        } catch (SQLException e) {
            return "Database connection error: " + e.getMessage();
        }
    }
    
    /**
     * Get database metadata information
     * @return Database information string
     */
    public String getDatabaseInfo() {
        try (Connection conn = getConnection()) {
            return "Database: " + conn.getMetaData().getDatabaseProductName() + 
                   " " + conn.getMetaData().getDatabaseProductVersion() +
                   " | URL: " + conn.getMetaData().getURL();
        } catch (SQLException e) {
            return "Unable to get database info: " + e.getMessage();
        }
    }
    
    /**
     * Execute a test query to verify connection
     * @return true if test query succeeds
     */
    public boolean testConnection() {
        try (Connection conn = getConnection()) {
            return conn.createStatement().executeQuery("SELECT 1") != null;
        } catch (SQLException e) {
            return false;
        }
    }
}