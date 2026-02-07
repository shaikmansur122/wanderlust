const mongoose = require("mongoose");
const { Schema } = mongoose;

const listingSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String
    },

    image: {
      filename: String,
      url: String
    },

    price: {
      type: Number
    },

    location: {
      type: String,
      required: true
    },

    country: {
      type: String
    },

    /* 🌟 Mood-Based Tag */
    mood: {
      type: String,
      enum: ["Relax", "Adventure", "Romantic", "Party", "Nature"],
      required: true
    },

    /* 📍 GeoJSON Location (Leaflet + OSM compatible) */
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: false
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: false,
        validate: {
          validator: function (val) {
            return !val || (Array.isArray(val) && val.length === 2);
          },
          message: "Coordinates must be [lng, lat]"
        }
      }
    },

    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review"
      }
    ],

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

// 🌍 Geospatial index (required for map queries)
listingSchema.index({ geometry: "2dsphere" });

module.exports = mongoose.model("Listing", listingSchema);
