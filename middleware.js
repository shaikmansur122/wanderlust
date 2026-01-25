const Review = require("./models/reviews");
const Listing = require("./models/listing");


// --------------------
// LOGIN CHECK
// --------------------
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in first!");
        return res.redirect("/login");
    }
    next();
};


// --------------------
// SAVE REDIRECT URL
// --------------------
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl;
    }
    next();
};


// --------------------
// REVIEW AUTHOR AUTHORIZATION
// --------------------
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};


// --------------------
// LISTING OWNER AUTHORIZATION
// --------------------
module.exports.isListingOwner = async (req, res, next) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};
