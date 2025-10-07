-- WanderFare Database Setup Script
-- Run this script to set up the database and user

-- Create database
CREATE DATABASE IF NOT EXISTS wanderfare;

-- Create user for the application
CREATE USER IF NOT EXISTS 'wanderfare_user'@'localhost' IDENTIFIED BY 'wanderfare_password123';

-- Grant all privileges on wanderfare database
GRANT ALL PRIVILEGES ON wanderfare.* TO 'wanderfare_user'@'localhost';

-- Refresh privileges
FLUSH PRIVILEGES;

-- Use the wanderfare database
USE wanderfare;

-- Show that database is ready
SELECT 'Database wanderfare is ready!' as status;
