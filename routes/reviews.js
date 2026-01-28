const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/expressError"); // 👈 needed
const { reviewSchema } = require("../schema");
const { isLoggedIn, isReviewAuthor } = require("../middleware");
const reviewController = require("../controllers/reviewController");

// --------------------
// VALIDATION
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
// CREATE & DELETE REVIEW
// /listings/:id/reviews
// --------------------
router.route("/")
    .post(
        isLoggedIn,
        validateReview,
        wrapAsync(reviewController.createReview)
    );

// --------------------
// DELETE REVIEW
// /listings/:id/reviews/:reviewId
// --------------------
router.route("/:reviewId")
    .delete(
        isLoggedIn,
        isReviewAuthor,
        wrapAsync(reviewController.deleteReview)
    );

module.exports = router;
