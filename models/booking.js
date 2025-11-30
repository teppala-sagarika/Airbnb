const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    paymentIntentId: String,
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'confirmed',
    },
    bookedAt: {
        type: Date,
        default: Date.now,
    }
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;