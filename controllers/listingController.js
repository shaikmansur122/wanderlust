const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");

/* INDEX */
module.exports.index = async (req, res) => {
  let filter = {};

  if (req.query.search) {
    const regex = new RegExp(req.query.search, "i");
    filter.$or = [{ title: regex }, { location: regex }];
  }

  if (req.query.mood) {
    filter.mood = req.query.mood;
  }

  const allListings = await Listing.find(filter).lean();
  res.render("listings/index", { allListings, search: req.query.search || "" });
};

/* SHOW */
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) throw new ExpressError(404, "Listing not found");

  res.render("listings/show", { listing });
};

/* NEW FORM */
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

/* CREATE */
module.exports.createListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "Listing created!");
  res.redirect(`/listings/${newListing._id}`);
};

/* EDIT FORM */
module.exports.renderEditForm = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) throw new ExpressError(404, "Listing not found");
  res.render("listings/edit", { listing });
};

/* UPDATE */
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, req.body.listing);
  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};

/* DELETE */
module.exports.deleteListing = async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Listing deleted");
  res.redirect("/listings");
};
