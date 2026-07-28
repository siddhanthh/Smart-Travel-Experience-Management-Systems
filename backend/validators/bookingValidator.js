const Joi = require('joi');

const createBookingSchema = Joi.object({
  trip_id: Joi.number().integer().required(),
  type: Joi.string().valid('hotel', 'flight', 'transport', 'activity').required(),
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().max(2000).allow('', null),
  amount: Joi.number().precision(2).positive().required(),
  booking_date: Joi.date().iso().required()
});

module.exports = { createBookingSchema };