-- ============================================================
-- STEMS — Smart Travel Experience Management System Seed Data
-- Comprehensive test dataset with realistic users, trips, bookings,
-- expenses, splits, and settlements.
--
-- Run this script to populate data into MySQL:
--   mysql -u root -p stems_db < database/seed.sql
-- ============================================================

USE stems_db;

-- Disable foreign key checks for clean truncation
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE settlements;
TRUNCATE TABLE expense_splits;
TRUNCATE TABLE expenses;
TRUNCATE TABLE bookings;
TRUNCATE TABLE trip_members;
TRUNCATE TABLE trips;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- ────────────────────────────────────────────
-- 1. SEED USERS
-- Passwords are all bcrypt hashed for 'password123'
-- ($2b$10$AM6B4K0gOdwUz0eWqD2orOaRjYk7TzmD6fjeWm11tBgUcOAd12b5W)
-- ────────────────────────────────────────────
INSERT INTO users (id, name, email, password, role) VALUES
(1, 'Admin User', 'admin@stems.com', '$2b$10$AM6B4K0gOdwUz0eWqD2orOaRjYk7TzmD6fjeWm11tBgUcOAd12b5W', 'admin'),
(2, 'Rahul Sharma', 'rahul@example.com', '$2b$10$AM6B4K0gOdwUz0eWqD2orOaRjYk7TzmD6fjeWm11tBgUcOAd12b5W', 'user'),
(3, 'Priya Patel', 'priya@example.com', '$2b$10$AM6B4K0gOdwUz0eWqD2orOaRjYk7TzmD6fjeWm11tBgUcOAd12b5W', 'user'),
(4, 'Amit Verma', 'amit@example.com', '$2b$10$AM6B4K0gOdwUz0eWqD2orOaRjYk7TzmD6fjeWm11tBgUcOAd12b5W', 'user'),
(5, 'Neha Singh', 'neha@example.com', '$2b$10$AM6B4K0gOdwUz0eWqD2orOaRjYk7TzmD6fjeWm11tBgUcOAd12b5W', 'user'),
(6, 'Vikram Malhotra', 'vikram@example.com', '$2b$10$AM6B4K0gOdwUz0eWqD2orOaRjYk7TzmD6fjeWm11tBgUcOAd12b5W', 'user'),
(7, 'Ananya Roy', 'ananya@example.com', '$2b$10$AM6B4K0gOdwUz0eWqD2orOaRjYk7TzmD6fjeWm11tBgUcOAd12b5W', 'user'),
(8, 'Karan Joshi', 'karan@example.com', '$2b$10$AM6B4K0gOdwUz0eWqD2orOaRjYk7TzmD6fjeWm11tBgUcOAd12b5W', 'user');

-- ────────────────────────────────────────────
-- 2. SEED TRIPS
-- ────────────────────────────────────────────
INSERT INTO trips (id, title, description, destination, start_date, end_date, max_members, status, created_by) VALUES
(1, 'Goa Beach Getaway & Water Sports', 'Sun, sand, nightlife, seafood, and scuba diving at Calangute & Anjuna beaches.', 'Goa, India', '2026-08-10', '2026-08-16', 5, 'active', 2),
(2, 'Manali Trekking & Adventure Expedition', 'High altitude mountain trek, Solang Valley paragliding, and river rafting in Kullu.', 'Manali, Himachal Pradesh', '2026-09-01', '2026-09-08', 6, 'planning', 3),
(3, 'Jaipur Cultural & Heritage Tour', 'Exploring Royal Palaces, Amber Fort, Hawa Mahal, and authentic Rajasthani thali feasts.', 'Jaipur, Rajasthan', '2026-07-15', '2026-07-20', 4, 'completed', 4),
(4, 'Kerala Backwaters & Tea Gardens Oasis', 'Houseboat cruise in Alleppey backwaters and lush tea plantations of Munnar.', 'Munnar & Alleppey, Kerala', '2026-10-05', '2026-10-12', 8, 'planning', 5),
(5, 'Ladakh Bike Trip & Pangong Tso Voyage', 'Epic motorcycle ride across Khardung La Pass, Nubra Valley, and Pangong Lake.', 'Leh Ladakh, India', '2026-11-01', '2026-11-10', 6, 'planning', 6);

-- ────────────────────────────────────────────
-- 3. SEED TRIP MEMBERS
-- ────────────────────────────────────────────
INSERT INTO trip_members (trip_id, user_id, role) VALUES
-- Goa Trip
(1, 2, 'organizer'),
(1, 3, 'member'),
(1, 4, 'member'),
(1, 5, 'member'),

-- Manali Trip
(2, 3, 'organizer'),
(2, 2, 'member'),
(2, 6, 'member'),
(2, 7, 'member'),

-- Jaipur Trip
(3, 4, 'organizer'),
(3, 3, 'member'),
(3, 7, 'member'),
(3, 8, 'member'),

-- Kerala Trip
(4, 5, 'organizer'),
(4, 2, 'member'),
(4, 3, 'member'),
(4, 6, 'member'),
(4, 8, 'member'),

-- Ladakh Trip
(5, 6, 'organizer'),
(5, 4, 'member'),
(5, 7, 'member'),
(5, 8, 'member');

-- ────────────────────────────────────────────
-- 4. SEED BOOKINGS
-- ────────────────────────────────────────────
INSERT INTO bookings (id, trip_id, user_id, type, title, description, amount, booking_date, status) VALUES
-- Goa Trip Bookings
(1, 1, 2, 'hotel', 'Taj Fort Aguada Beach Resort', '2 Deluxe Sea View Rooms for 5 Nights', 18500.00, '2026-08-10', 'confirmed'),
(2, 1, 3, 'flight', 'Indigo Flight Delhi to Goa (Roundtrip)', 'Non-stop flights for group members', 14200.00, '2026-08-10', 'confirmed'),
(3, 1, 4, 'transport', 'Mahindra Thar Rental 4 Days', 'Self-drive open jeep for North Goa exploration', 9600.00, '2026-08-11', 'confirmed'),
(4, 1, 5, 'activity', 'Scuba Diving & Water Sports at Malvan', 'Deep sea diving with HD video & photos', 6400.00, '2026-08-13', 'pending'),

-- Manali Trip Bookings
(5, 2, 3, 'hotel', 'Span Resort & Spa Riverfront Villa', 'Luxury cottage along Beas river', 22000.00, '2026-09-01', 'confirmed'),
(6, 2, 6, 'activity', 'Solang Valley Tandem Paragliding & Ropeway', 'High flying adventure ride with instructor', 5200.00, '2026-09-03', 'confirmed'),
(7, 2, 2, 'transport', 'Volvo AC Bus Delhi to Manali (Return)', 'Overnight Volvo semi-sleeper tickets', 7800.00, '2026-09-01', 'confirmed'),

-- Jaipur Trip Bookings
(8, 3, 4, 'hotel', 'Samode Haveli Heritage Suite', 'Royal courtyard rooms in Old Jaipur city', 16000.00, '2026-07-15', 'confirmed'),
(9, 3, 8, 'activity', 'Amber Fort & Nahargarh Sunset Tour', 'Private guide & entry passes for Forts', 3500.00, '2026-07-16', 'confirmed'),

-- Kerala Trip Bookings
(10, 4, 5, 'hotel', 'Alleppey Deluxe 2-Bedroom Houseboat', 'Private overnight cruise with traditional meals', 15500.00, '2026-10-06', 'confirmed');

-- ────────────────────────────────────────────
-- 5. SEED EXPENSES
-- ────────────────────────────────────────────
INSERT INTO expenses (id, trip_id, paid_by, title, amount) VALUES
(1, 1, 2, 'Group Dinner at Curlies Beach Shack Anjuna', 4800.00),
(2, 1, 3, 'Water Sports & Banana Boat Ride at Baga', 6000.00),
(3, 1, 4, 'Fuel & Toll Charges for Goa Sightseeing', 2400.00),
(4, 2, 3, 'Campfire & Barbecue Evening in Manali', 3600.00),
(5, 2, 6, 'Trekking Equipment & Local Guide Fee', 5200.00),
(6, 3, 4, 'Rajasthani Thali Feast at Chokhi Dhani', 3200.00);

-- ────────────────────────────────────────────
-- 6. SEED EXPENSE SPLITS
-- ────────────────────────────────────────────
INSERT INTO expense_splits (expense_id, user_id, amount) VALUES
-- Expense 1 (Goa Dinner ₹4800 split among 4 users)
(1, 2, 1200.00),
(1, 3, 1200.00),
(1, 4, 1200.00),
(1, 5, 1200.00),

-- Expense 2 (Goa Water Sports ₹6000 split among 4 users)
(2, 2, 1500.00),
(2, 3, 1500.00),
(2, 4, 1500.00),
(2, 5, 1500.00),

-- Expense 3 (Goa Fuel ₹2400 split among 4 users)
(3, 2, 600.00),
(3, 3, 600.00),
(3, 4, 600.00),
(3, 5, 600.00),

-- Expense 4 (Manali Barbecue ₹3600 split among 4 users)
(4, 3, 900.00),
(4, 2, 900.00),
(4, 6, 900.00),
(4, 7, 900.00),

-- Expense 5 (Manali Trekking ₹5200 split among 4 users)
(5, 3, 1300.00),
(5, 2, 1300.00),
(5, 6, 1300.00),
(5, 7, 1300.00),

-- Expense 6 (Jaipur Feast ₹3200 split among 4 users)
(6, 4, 800.00),
(6, 3, 800.00),
(6, 7, 800.00),
(6, 8, 800.00);

-- ────────────────────────────────────────────
-- 7. SEED SETTLEMENTS
-- ────────────────────────────────────────────
INSERT INTO settlements (id, trip_id, payer_id, payee_id, amount, status) VALUES
(1, 1, 3, 2, 1200.00, 'completed'),
(2, 2, 2, 3, 900.00, 'completed');
