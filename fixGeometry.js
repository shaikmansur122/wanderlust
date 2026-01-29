require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios");
const Listing = require("./models/listing");

mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
  .then(() => console.log("Mongo connected"));

async function updateListings() {
  const listings = await Listing.find({ geometry: { $exists: false } });

  console.log("Listings to fix:", listings.length);

  for (let listing of listings) {
    try {
      const res = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: listing.location,
            format: "json",
            limit: 1,
          },
          headers: { "User-Agent": "wanderlust-app" },
        }
      );

      if (res.data.length === 0) {
        console.log("No location found for:", listing.title);
        continue;
      }

      const lat = parseFloat(res.data[0].lat);
      const lng = parseFloat(res.data[0].lon);

      listing.geometry = {
        type: "Point",
        coordinates: [lng, lat],
      };

      await listing.save();
      console.log("Updated:", listing.title);

    } catch (err) {
      console.log("Error for", listing.title, err.message);
    }
  }

  console.log("Done fixing listings");
  mongoose.connection.close();
}

updateListings();
