const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const { cloudinary } = require("../cloudConfig");
const axios = require("axios");

/* ================= INDEX + SEARCH + MOOD FILTER ================= */
module.exports.index = async (req, res) => {
  let filter = {};

  // 🔍 Text Search
  if (req.query.search) {
    const regex = new RegExp(req.query.search, "i");
    filter.$or = [{ title: regex }, { location: regex }];
  }

  // 🌟 Mood Filter
  if (req.query.mood) {
    filter.mood = req.query.mood;
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

  if (!listing.geometry || !listing.geometry.coordinates) {
    try {
      const geoRes = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: { q: listing.location, format: "json", limit: 1 },
        headers: { "User-Agent": "wanderlust-app" }
      });

      if (geoRes.data.length) {
        const { lon, lat } = geoRes.data[0];
        listing.geometry = { type: "Point", coordinates: [parseFloat(lon), parseFloat(lat)] };
        await listing.save();
      }
    } catch (err) {
      console.log("Geocoding failed:", err.message);
    }
  }

  res.render("listings/show", { listing });
};

/* ================= OTHER FUNCTIONS (UNCHANGED) ================= */
// renderNewForm, createListing, updateListing, deleteListing stay same
