const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate } = require('../middleware/auth');
const { isTripMember } = require('../middleware/membership');
const validate = require('../middleware/validate');
const { createBookingSchema } = require('../validators/bookingValidator');

router.use(authenticate);

/**
 * @openapi
 * /bookings:
 *   post:
 *     summary: Create a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [trip_id, type, title, amount, booking_date]
 *             properties:
 *               trip_id:
 *                 type: integer
 *               type:
 *                 type: string
 *                 enum: [hotel, flight, transport, activity]
 *               title:
 *                 type: string
 *               amount:
 *                 type: number
 *               booking_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Booking created
 */
router.post('/', validate(createBookingSchema), isTripMember, bookingController.createBooking);

/**
 * @openapi
 * /bookings/trip/{tripId}:
 *   get:
 *     summary: List bookings for a trip
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Bookings list
 */
router.get('/trip/:tripId', isTripMember, bookingController.getTripBookings);
router.get('/:id', bookingController.getBookingById);
router.put('/:id/cancel', bookingController.cancelBooking);

module.exports = router;