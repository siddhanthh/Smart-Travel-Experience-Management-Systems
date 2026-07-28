const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate } = require('../middleware/auth');
const { isTripMember } = require('../middleware/membership');
const validate = require('../middleware/validate');
const { createBookingSchema } = require('../validators/bookingValidator');

router.use(authenticate);

router.post('/', validate(createBookingSchema), isTripMember, bookingController.createBooking);
router.get('/trip/:tripId', isTripMember, bookingController.getTripBookings);
router.get('/:id', bookingController.getBookingById);
router.put('/:id/cancel', bookingController.cancelBooking);

module.exports = router;