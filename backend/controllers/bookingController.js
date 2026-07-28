const bookingService = require('../services/bookingService');

exports.createBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.createBooking(req.body, req.user.id);
    res.status(201).json({ message: 'Booking created successfully', data: booking });
  } catch (err) {
    next(err);
  }
};

exports.getTripBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getTripBookings(req.params.tripId);
    res.status(200).json({ data: bookings });
  } catch (err) {
    next(err);
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    res.status(200).json({ data: booking });
  } catch (err) {
    next(err);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const result = await bookingService.cancelBooking(req.params.id, req.user.id, req.user.role);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};