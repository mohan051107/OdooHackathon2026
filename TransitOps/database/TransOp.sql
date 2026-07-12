-- ======================================================
-- TransitOps - Smart Transport Operations Platform
-- Database Schema for PostgreSQL / Supabase
-- ======================================================

-- Enable UUID extension if needed (optional)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ======================================================
-- ENUM TYPES
-- ======================================================

CREATE TYPE user_role AS ENUM (
    'FLEET_MANAGER',
    'DRIVER',
    'SAFETY_OFFICER',
    'FINANCIAL_ANALYST'
);

CREATE TYPE vehicle_status AS ENUM (
    'AVAILABLE',
    'ON_TRIP',
    'IN_SHOP',
    'RETIRED'
);

CREATE TYPE driver_status AS ENUM (
    'AVAILABLE',
    'ON_TRIP',
    'OFF_DUTY',
    'SUSPENDED'
);

CREATE TYPE trip_status AS ENUM (
    'DRAFT',
    'DISPATCHED',
    'COMPLETED',
    'CANCELLED'
);

CREATE TYPE maintenance_status AS ENUM (
    'ACTIVE',
    'COMPLETED'
);

-- ======================================================
-- TABLES
-- ======================================================

-- ----------------------------
-- 1. Users
-- ----------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'FLEET_MANAGER',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE users IS 'System users with role-based access control';
COMMENT ON COLUMN users.email IS 'Unique email used for login';
COMMENT ON COLUMN users.password IS 'Encrypted password (BCrypt recommended)';
COMMENT ON COLUMN users.role IS 'User role: FLEET_MANAGER, DRIVER, etc.';

-- ----------------------------
-- 2. Vehicles
-- ----------------------------
CREATE TABLE IF NOT EXISTS vehicles (
    id BIGSERIAL PRIMARY KEY,
    registration_number VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    max_load_capacity DECIMAL(12,2) NOT NULL CHECK (max_load_capacity >= 0),
    odometer DECIMAL(12,2) DEFAULT 0.00 CHECK (odometer >= 0),
    acquisition_cost DECIMAL(15,2) DEFAULT 0.00 CHECK (acquisition_cost >= 0),
    status vehicle_status NOT NULL DEFAULT 'AVAILABLE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE vehicles IS 'Fleet vehicle registry';
COMMENT ON COLUMN vehicles.registration_number IS 'Unique vehicle registration number';
COMMENT ON COLUMN vehicles.max_load_capacity IS 'Maximum cargo weight in kg';
COMMENT ON COLUMN vehicles.odometer IS 'Total distance traveled in km';
COMMENT ON COLUMN vehicles.status IS 'Current vehicle status';

-- ----------------------------
-- 3. Drivers
-- ----------------------------
CREATE TABLE IF NOT EXISTS drivers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    license_number VARCHAR(50) NOT NULL UNIQUE,
    license_category VARCHAR(50) NOT NULL,
    license_expiry_date DATE NOT NULL,
    contact_number VARCHAR(20),
    safety_score DECIMAL(5,2) DEFAULT 100.00 CHECK (safety_score BETWEEN 0 AND 100),
    status driver_status NOT NULL DEFAULT 'AVAILABLE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE drivers IS 'Driver profiles with license and safety information';
COMMENT ON COLUMN drivers.license_number IS 'Unique driving license number';
COMMENT ON COLUMN drivers.license_expiry_date IS 'Expiry date of license';
COMMENT ON COLUMN drivers.safety_score IS 'Safety rating (0-100)';

-- ----------------------------
-- 4. Trips
-- ----------------------------
CREATE TABLE IF NOT EXISTS trips (
    id BIGSERIAL PRIMARY KEY,
    source VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    cargo_weight DECIMAL(12,2) NOT NULL CHECK (cargo_weight >= 0),
    planned_distance DECIMAL(12,2) NOT NULL CHECK (planned_distance >= 0),
    actual_distance DECIMAL(12,2) CHECK (actual_distance >= 0),
    fuel_consumed DECIMAL(10,2) CHECK (fuel_consumed >= 0),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    vehicle_id BIGINT NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    driver_id BIGINT NOT NULL REFERENCES drivers(id) ON DELETE RESTRICT,
    status trip_status NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE trips IS 'Trip records from creation to completion';
COMMENT ON COLUMN trips.cargo_weight IS 'Weight of cargo in kg';
COMMENT ON COLUMN trips.actual_distance IS 'Actual distance traveled in km (filled on completion)';
COMMENT ON COLUMN trips.fuel_consumed IS 'Fuel consumed in liters (filled on completion)';
COMMENT ON COLUMN trips.status IS 'Current trip lifecycle status';

-- ----------------------------
-- 5. Maintenance Logs
-- ----------------------------
CREATE TABLE IF NOT EXISTS maintenance (
    id BIGSERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    cost DECIMAL(15,2) DEFAULT 0.00 CHECK (cost >= 0),
    vehicle_id BIGINT NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    status maintenance_status NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE maintenance IS 'Vehicle maintenance records';
COMMENT ON COLUMN maintenance.start_date IS 'Date maintenance started';
COMMENT ON COLUMN maintenance.end_date IS 'Date maintenance completed';

-- ----------------------------
-- 6. Fuel Logs
-- ----------------------------
CREATE TABLE IF NOT EXISTS fuel_logs (
    id BIGSERIAL PRIMARY KEY,
    liters DECIMAL(10,2) NOT NULL CHECK (liters >= 0),
    cost_per_liter DECIMAL(10,2) NOT NULL CHECK (cost_per_liter >= 0),
    total_cost DECIMAL(12,2) GENERATED ALWAYS AS (liters * cost_per_liter) STORED,
    fuel_date DATE NOT NULL DEFAULT CURRENT_DATE,
    vehicle_id BIGINT NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    trip_id BIGINT REFERENCES trips(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE fuel_logs IS 'Fuel purchase and consumption logs';
COMMENT ON COLUMN fuel_logs.total_cost IS 'Automatically computed as liters * cost_per_liter';

-- ----------------------------
-- 7. Expenses (Other than fuel)
-- ----------------------------
CREATE TABLE IF NOT EXISTS expenses (
    id BIGSERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL CHECK (amount >= 0),
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    category VARCHAR(100) NOT NULL, -- e.g., Tolls, Repairs, Insurance, etc.
    vehicle_id BIGINT REFERENCES vehicles(id) ON DELETE RESTRICT,
    trip_id BIGINT REFERENCES trips(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE expenses IS 'Non-fuel operational expenses';
COMMENT ON COLUMN expenses.category IS 'Expense category for reporting';

-- ======================================================
-- INDEXES FOR PERFORMANCE
-- ======================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_registration ON vehicles(registration_number);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_drivers_license_expiry ON drivers(license_expiry_date);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_vehicle_id ON trips(vehicle_id);
CREATE INDEX idx_trips_driver_id ON trips(driver_id);
CREATE INDEX idx_trips_start_time ON trips(start_time);
CREATE INDEX idx_maintenance_vehicle_id ON maintenance(vehicle_id);
CREATE INDEX idx_maintenance_status ON maintenance(status);
CREATE INDEX idx_fuel_logs_vehicle_id ON fuel_logs(vehicle_id);
CREATE INDEX idx_fuel_logs_trip_id ON fuel_logs(trip_id);
CREATE INDEX idx_fuel_logs_fuel_date ON fuel_logs(fuel_date);
CREATE INDEX idx_expenses_vehicle_id ON expenses(vehicle_id);
CREATE INDEX idx_expenses_trip_id ON expenses(trip_id);
CREATE INDEX idx_expenses_expense_date ON expenses(expense_date);

-- ======================================================
-- TRIGGERS FOR AUTO-UPDATE updated_at
-- ======================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
BEFORE UPDATE ON vehicles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drivers_updated_at
BEFORE UPDATE ON drivers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at
BEFORE UPDATE ON trips
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_updated_at
BEFORE UPDATE ON maintenance
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ======================================================
-- SAMPLE DATA (Optional - for quick testing)
-- ======================================================

-- Insert a default admin user (password: admin123)
INSERT INTO users (email, password, full_name, role)
VALUES ('admin@transitops.com', 'admin123', 'Admin User', 'FLEET_MANAGER')
ON CONFLICT (email) DO NOTHING;

-- Insert a sample vehicle
INSERT INTO vehicles (registration_number, name, type, max_load_capacity, odometer, acquisition_cost, status)
VALUES ('MH-01-AB-1234', 'Truck-01', 'Truck', 5000.00, 15000.00, 2500000.00, 'AVAILABLE')
ON CONFLICT (registration_number) DO NOTHING;

-- Insert a sample driver
INSERT INTO drivers (name, license_number, license_category, license_expiry_date, contact_number, safety_score, status)
VALUES ('John Doe', 'DL-123456789', 'Heavy Vehicle', '2025-12-31', '9876543210', 95.00, 'AVAILABLE')
ON CONFLICT (license_number) DO NOTHING;

-- ======================================================
-- END OF SCHEMA
-- ======================================================