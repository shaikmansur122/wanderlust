const Listing = require("../models/listing");
const ExpressError = require("../utils/expressError");
const mongoose = require("mongoose");
const { cloudinary } = require("../cloudConfig");

// INDEX
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({}).lean();
    res.render("listings/index", { allListings });
};

// SHOW
module.exports.showListing = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(400, "Invalid Listing ID");
    }

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner");

    if (!listing) throw new ExpressError(404, "Listing not found");

    res.render("listings/show", { listing });
};

// NEW FORM
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
};

// CREATE
module.exports.createListing = async (req, res) => {
    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;

    newListing.image = {
        url: req.file.path,
        filename: req.file.filename
    };

    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};


// EDIT FORM
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) throw new ExpressError(404, "Listing not found");

    res.render("listings/edit", { listing });
};

// UPDATE
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findByIdAndUpdate(
    id,
    req.body.listing,
    { new: true, runValidators: true }
  );

  if (!listing) throw new ExpressError(404, "Listing not found");

  // If user uploaded new image
  if (req.file) {
    // Delete old image from Cloudinary
    await cloudinary.uploader.destroy(listing.image.filename);

    // Save new image
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };

    await listing.save();
  }

  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};


// DELETE
module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findByIdAndDelete(id);
    if (!listing) throw new ExpressError(404, "Listing not found");

    req.flash("success", "Listing deleted");
    res.redirect("/listings");
};
