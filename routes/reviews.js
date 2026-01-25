const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/expressError");
const { reviewSchema } = require("../schema");

const Listing = require("../models/listing");
const Review = require("../models/reviews");
const { isLoggedIn, isReviewAuthor } = require("../middleware");


// --------------------
// JOI VALIDATION
// --------------------
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, msg);
  }
  next();
};


// --------------------
// CREATE REVIEW
// POST /listings/:id/reviews
// --------------------
router.post(
  "/",
  isLoggedIn,         
  validateReview,
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) throw new ExpressError(404, "Listing not found");

    const review = new Review(req.body.review);

    review.author = req.user._id;   

    await review.save();

    listing.reviews.push(review._id);
    await listing.save();

    req.flash("success", "New review created!");
    res.redirect(`/listings/${id}`);
  })
);


// --------------------
// DELETE REVIEW
// DELETE /listings/:id/reviews/:reviewId
// --------------------
router.delete(
  "/:reviewId",
  isLoggedIn,          
  isReviewAuthor,      
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId }
    });

    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
