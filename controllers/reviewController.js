const Listing = require("../models/listing");
const Review = require("../models/reviews");
const ExpressError = require("../utils/expressError");

// CREATE REVIEW
module.exports.createReview = async (req, res) => {
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
};

// DELETE REVIEW
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });

    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);
};
