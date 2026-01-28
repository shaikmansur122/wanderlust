const Joi = require("joi");

/**
 * LISTING VALIDATION SCHEMA
 * Now image is NOT validated here
 * because file upload comes via multer (req.file)
 */
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    price: Joi.number().min(0).required(),
    country: Joi.string().trim().required(),
    location: Joi.string().trim().required(),
  }).required(),
});

/**
 * REVIEW VALIDATION SCHEMA
 */
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().trim().required(),
  }).required(),
});
 