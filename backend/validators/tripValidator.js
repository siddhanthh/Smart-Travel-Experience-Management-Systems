const Joi = require('joi');

const createTripSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().max(2000).allow('', null),
  destination: Joi.string().min(2).max(200).required(),
  start_date: Joi.date().iso().required(),
  end_date: Joi.date().iso().greater(Joi.ref('start_date')).required().messages({
    'date.greater': 'end_date must be after start_date'
  }),
  max_members: Joi.number().integer().min(2).max(100).default(10)
});

const updateTripSchema = Joi.object({
  title: Joi.string().min(3).max(200),
  description: Joi.string().max(2000).allow('', null),
  destination: Joi.string().min(2).max(200),
  start_date: Joi.date().iso(),
  end_date: Joi.date().iso(),
  max_members: Joi.number().integer().min(2).max(100),
  status: Joi.string().valid('planning', 'active', 'completed', 'cancelled')
});

module.exports = { createTripSchema, updateTripSchema };