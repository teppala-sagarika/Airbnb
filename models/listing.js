const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        type: String,
        default: "https://unsplash.com/photos/snow-capped-mountain-peak-bathed-in-golden-sunlight-B9fkw_aO6fo",
        set: (v) => v === "" ? "https://unsplash.com/photos/snow-capped-mountain-peak-bathed-in-golden-sunlight-B9fkw_aO6fo" : v
    },
    price: Number,
    location: String,
    country: String
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;