const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");

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
    price: {
        type: Number,
        set: v => Number(v)
    },
    location: String,
    country: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;