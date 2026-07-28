const Joi = require('joi');

const createPostSchema = Joi.object({
  tripId: Joi.number().integer().required(),
  content: Joi.string().min(1).max(3000).required()
});

const createCommentSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required()
});

module.exports = { createPostSchema, createCommentSchema };