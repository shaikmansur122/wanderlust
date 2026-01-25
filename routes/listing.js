const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/expressError");
const { listingSchema } = require("../schema");

const Listing = require("../models/listing");
const { isLoggedIn, isListingOwner } = require("../middleware");


// --------------------
// JOI VALIDATION
// --------------------
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, msg);
    }
    next();
};


// --------------------
// INDEX
// --------------------
router.get(
    "/",
    wrapAsync(async (req, res) => {
        const allListings = await Listing.find({});
        res.render("listings/index", { allListings });
    })
);


// --------------------
// NEW FORM
// --------------------
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new");
});


// --------------------
// SHOW
// --------------------
router.get(
    "/:id",
    wrapAsync(async (req, res) => {
        const { id } = req.params;

       const listing = await Listing.findById(id)
  .populate({
    path: "reviews",
    populate: { path: "author" }  
  })
  .populate("owner");

        if (!listing) throw new ExpressError(404, "Listing not found");

        res.render("listings/show", { listing });
    })
);


// --------------------
// CREATE
// --------------------
router.post(
    "/",
    isLoggedIn,
    validateListing,
    wrapAsync(async (req, res) => {
        const newListing = new Listing(req.body.listing);

        newListing.owner = req.user._id;   

        await newListing.save();

        req.flash("success", "New Listing Created");
        res.redirect("/listings");
    })
);


// --------------------
// EDIT FORM
// --------------------
router.get(
    "/:id/edit",
    isLoggedIn,
    isListingOwner,   
    wrapAsync(async (req, res) => {
        const { id } = req.params;

        const listing = await Listing.findById(id);
        if (!listing) throw new ExpressError(404, "Listing not found");

        res.render("listings/edit", { listing });
    })
);


// --------------------
// UPDATE
// --------------------
router.put(
    "/:id",
    isLoggedIn,
    isListingOwner,   
    validateListing,
    wrapAsync(async (req, res) => {
        const { id } = req.params;

        const listing = await Listing.findByIdAndUpdate(
            id,
            req.body.listing,
            { runValidators: true, new: true }
        );

        if (!listing) throw new ExpressError(404, "Listing not found");

        req.flash("success", "Listing updated!");
        res.redirect(`/listings/${id}`);
    })
);


// --------------------
// DELETE
// --------------------
router.delete(
    "/:id",
    isLoggedIn,
    isListingOwner,  
    wrapAsync(async (req, res) => {
        const { id } = req.params;

        const listing = await Listing.findByIdAndDelete(id);
        if (!listing) throw new ExpressError(404, "Listing not found");

        req.flash("success", "Listing deleted");
        res.redirect("/listings");
    })
);


module.exports = router;
