const Joi = require("joi");

/**
 * LISTING VALIDATION SCHEMA
 * Matches:
 * req.body = { listing: { ... } }
 */
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string()
      .trim()
      .required(),

    description: Joi.string()
      .trim()
      .required(),

    price: Joi.number()
      .min(0)
      .required(),

    country: Joi.string()
      .trim()
      .required(),

    location: Joi.string()
      .trim()
      .required(),

    image: Joi.object({
      url: Joi.string().allow("", null),
      filename: Joi.string().allow("", null),
    }).required(), // object must exist (even if empty)
  }).required()
});

/**
 * REVIEW VALIDATION SCHEMA
 * Matches:
 * req.body = { review: { ... } }
 */
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number()
      .min(1)
      .max(5)
      .required(),

    comment: Joi.string()
      .trim()
      .required(),
  }).required()
});
