-- ============================================================
-- STEMS — Smart Travel Experience Management System Seed Data
-- Run this script to populate sample data for testing:
--   mysql -u root -p stems_db < database/seed.sql
-- ============================================================

USE stems_db;

-- Clear existing data (in reverse dependency order)
DELETE FROM settlements;
DELETE FROM expense_splits;
DELETE FROM expenses;
DELETE FROM bookings;
DELETE FROM trip_members;
DELETE FROM trips;
DELETE FROM users;

-- ────────────────────────────────────────────
-- 1. SEED USERS
-- Passwords are bcrypt hashed for 'password123'
-- ($2b$10$AM6B4K0gOdwUz0eWqD2orOaRjYk7TzmD6fjeWm11tBgUcOAd12b5W)
-- ────────────────────────────────────────────
INSERT INTO users (id, name, email, password, role) VALUES
(1, 'Admin User', 'admin@stems.com', '$2b$10$AM6B4K0gOdwUz0eWqD2orOaRjYk7TzmD6fjeWm11tBgUcOAd12b5W', 'admin'),
(2, 'Rahul Sharma', 'rahul@example.com', '$2b$10$AM6B4K0gOdwUz0eWqD2orOaRjYk7TzmD6fjeWm11tBgUcOAd12b5W', 'user'),
(3, 'Priya Patel', 'priya@example.com', '$2b$10$AM6B4K0gOdwUz0eWqD2orOaRjYk7TzmD6fjeWm11tBgUcOAd12b5W', 'user'),
(4, 'Amit Verma', 'amit@example.com', '$2b$10$AM6B4K0gOdwUz0eWqD2orOaRjYk7TzmD6fjeWm11tBgUcOAd12b5W', 'user');

-- ────────────────────────────────────────────
-- 2. SEED TRIPS
-- ────────────────────────────────────────────
INSERT INTO trips (id, title, description, destination, start_date, end_date, max_members, status, created_by) VALUES
(1, 'Goa Beach Trip', 'Weekend getaway to Calangute & Anjuna beaches', 'Goa, India', '2026-08-10', '2026-08-15', 5, 'planning', 2),
(2, 'Manali Trekking Expedition', 'High altitude mountain trek and adventure sports', 'Manali, Himachal Pradesh', '2026-09-01', '2026-09-07', 6, 'active', 3);

-- ────────────────────────────────────────────
-- 3. SEED TRIP MEMBERS
-- ────────────────────────────────────────────
INSERT INTO trip_members (trip_id, user_id, role) VALUES
(1, 2, 'organizer'),
(1, 3, 'member'),
(1, 4, 'member'),
(2, 3, 'organizer'),
(2, 2, 'member');

-- ────────────────────────────────────────────
-- 4. SEED BOOKINGS
-- ────────────────────────────────────────────
INSERT INTO bookings (id, trip_id, user_id, type, title, description, amount, booking_date, status) VALUES
(1, 1, 2, 'hotel', 'Beachside Resort 2 Rooms', 'Ocean view deluxe suites', 12000.00, '2026-08-10', 'confirmed'),
(2, 1, 3, 'flight', 'Delhi to Goa Flight', 'Indigo non-stop roundtrip', 15000.00, '2026-08-10', 'confirmed'),
(3, 2, 3, 'activity', 'Paragliding & Rafting Package', 'Solang valley adventure booking', 4500.00, '2026-09-02', 'pending');

-- ────────────────────────────────────────────
-- 5. SEED EXPENSES & SPLITS
-- ────────────────────────────────────────────
INSERT INTO expenses (id, trip_id, paid_by, title, amount) VALUES
(1, 1, 2, 'Group Dinner at Curlies Beach Shack', 3000.00);

INSERT INTO expense_splits (expense_id, user_id, amount) VALUES
(1, 2, 1000.00),
(1, 3, 1000.00),
(1, 4, 1000.00);
