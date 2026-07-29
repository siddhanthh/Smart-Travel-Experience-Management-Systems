const Joi = require('joi');

const addExpenseSchema = Joi.object({
  trip_id: Joi.number().integer().required(),
  title: Joi.string().min(2).max(200).required(),
  amount: Joi.number().positive().required(),
  split_among: Joi.array().items(Joi.number().integer()).optional()
});

const settleSchema = Joi.object({
  trip_id: Joi.number().integer().required(),
  payee_id: Joi.number().integer().required(),
  amount: Joi.number().positive().required()
});

module.exports = { addExpenseSchema, settleSchema };