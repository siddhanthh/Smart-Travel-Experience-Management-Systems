-- ============================================================
-- STEMS — Smart Travel Experience Management System Database Schema
-- Run this script to create the database and all SQL tables:
--   mysql -u root -p < database/schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS stems_db;
USE stems_db;

-- ────────────────────────────────────────────
-- 1. USERS TABLE
-- Stores credentials, profile data, and roles ('admin', 'user')
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- ────────────────────────────────────────────
-- 2. TRIPS TABLE
-- Stores group travel planning details created by users
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trips (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  destination VARCHAR(200) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  max_members INT DEFAULT 10,
  status ENUM('planning', 'active', 'completed', 'cancelled') DEFAULT 'planning',
  created_by INT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_destination (destination),
  INDEX idx_dates (start_date, end_date)
);

-- ────────────────────────────────────────────
-- 3. TRIP MEMBERS TABLE
-- Junction table connecting users to trips (prevents double-joining)
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trip_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trip_id INT NOT NULL,
  user_id INT NOT NULL,
  role ENUM('organizer', 'member') DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_trip_member (trip_id, user_id)
);

-- ────────────────────────────────────────────
-- 4. BOOKINGS TABLE
-- Accommodations, transport, flights, and activity reservations
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trip_id INT NOT NULL,
  user_id INT NOT NULL,
  type ENUM('hotel', 'flight', 'transport', 'activity') NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  booking_date DATE,
  status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_booking (trip_id, user_id, type, booking_date),
  INDEX idx_trip_status (trip_id, status)
);

-- ────────────────────────────────────────────
-- 5. EXPENSES TABLE
-- Trip expenses paid by group members
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trip_id INT NOT NULL,
  paid_by INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  FOREIGN KEY (paid_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_trip (trip_id)
);

-- ────────────────────────────────────────────
-- 6. EXPENSE SPLITS TABLE
-- Individual split amounts owed by each trip member
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS expense_splits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  expense_id INT NOT NULL,
  user_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,

  FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ────────────────────────────────────────────
-- 7. SETTLEMENTS TABLE
-- Payments made between members to settle outstanding balances
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS settlements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trip_id INT NOT NULL,
  payer_id INT NOT NULL,
  payee_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'completed') DEFAULT 'completed',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  FOREIGN KEY (payer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (payee_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_trip_status (trip_id, status)
);
