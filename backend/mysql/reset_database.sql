-- Reset WanderFare Database Script
-- Use this to completely reset the database

-- Drop database if exists
DROP DATABASE IF EXISTS wanderfare;

-- Recreate database
CREATE DATABASE wanderfare;

-- Use the database
USE wanderfare;

-- Drop user if exists and recreate
DROP USER IF EXISTS 'wanderfare_user'@'localhost';
CREATE USER 'wanderfare_user'@'localhost' IDENTIFIED BY 'wanderfare_password123';

-- Grant privileges
GRANT ALL PRIVILEGES ON wanderfare.* TO 'wanderfare_user'@'localhost';
FLUSH PRIVILEGES;

SELECT 'Database reset complete! Restart the application to recreate tables.' as status;
