const mongoose = require("mongoose");
const { Schema } = mongoose;

const listingSchema = new Schema({
    title: {
        url: String,
        filename: String
    },
    description: String,
    image: {
        filename: String,
        url: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {                     // ✅ fixed name
        type: Schema.Types.ObjectId,
        ref: "User",              // ✅ must match model name exactly
    }
});

module.exports = mongoose.model("Listing", listingSchema);
