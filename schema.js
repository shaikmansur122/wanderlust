const Joi = require("joi");

/**
 * LISTING VALIDATION SCHEMA
 * Now image is NOT validated here
 * because file upload comes via multer (req.file)
 */


module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),
    mood: Joi.string()
      .valid("Relax", "Adventure", "Romantic", "Party", "Nature")
      .required()
  }).required()
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
 