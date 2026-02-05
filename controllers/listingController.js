const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const { cloudinary } = require("../cloudConfig");
const axios = require("axios");

/* ================= INDEX + SEARCH ================= */
module.exports.index = async (req, res) => {
  let filter = {};

  if (req.query.search) {
    const regex = new RegExp(req.query.search, "i"); // case-insensitive
    filter.$or = [
      { title: regex },
      { location: regex }
    ];
  }

  const allListings = await Listing.find(filter).lean();

  res.render("listings/index", {
    allListings,
    search: req.query.search || ""
  });
};

/* ================= SHOW ================= */
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) throw new ExpressError(404, "Listing not found");

  // Auto-fix geometry if missing
  if (!listing.geometry || !listing.geometry.coordinates) {
    try {
      const geoRes = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: { q: listing.location, format: "json", limit: 1 },
        headers: { "User-Agent": "wanderlust-app" }
      });

      if (geoRes.data.length) {
        const { lon, lat } = geoRes.data[0];
        listing.geometry = {
          type: "Point",
          coordinates: [parseFloat(lon), parseFloat(lat)]
        };
        await listing.save();
      }
    } catch (err) {
      console.log("Geocoding failed:", err.message);
    }
  }

  res.render("listings/show", { listing });
};

/* ================= NEW FORM ================= */
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

/* ================= CREATE ================= */
module.exports.createListing = async (req, res) => {
  const locationText = req.body.listing.location;

  try {
    const geoRes = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: { q: locationText, format: "json", limit: 1 },
      headers: { "User-Agent": "wanderlust-app" }
    });

    if (!geoRes.data.length) throw new ExpressError(400, "Invalid location");

    const lat = geoRes.data[0].lat;
    const lng = geoRes.data[0].lon;

    const newListing = new Listing(req.body.listing);
    newListing.geometry = {
      type: "Point",
      coordinates: [parseFloat(lng), parseFloat(lat)]
    };
    newListing.owner = req.user._id;

    await newListing.save();
    req.flash("success", "Listing created!");
    res.redirect(`/listings/${newListing._id}`);

  } catch (err) {
    throw new ExpressError(500, "Location lookup failed");
  }
};

/* ================= EDIT FORM ================= */
module.exports.renderEditForm = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) throw new ExpressError(404, "Listing not found");
  res.render("listings/edit", { listing });
};

/* ================= UPDATE ================= */
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
  if (!listing) throw new ExpressError(404, "Listing not found");

  if (req.file) {
    await cloudinary.uploader.destroy(listing.image.filename);
    listing.image = { url: req.file.path, filename: req.file.filename };
    await listing.save();
  }

  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};

/* ================= DELETE ================= */
module.exports.deleteListing = async (req, res) => {
  const listing = await Listing.findByIdAndDelete(req.params.id);
  if (!listing) throw new ExpressError(404, "Listing not found");

  req.flash("success", "Listing deleted");
  res.redirect("/listings");
};
