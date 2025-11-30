const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Listing = require('../models/listing');
const Booking = require('../models/booking');

module.exports.confirmBooking = async(req, res) => {
    const { id } = req.params; // Listing ID
    const userId = req.user._id;

    // Check if a booking already exists to prevent duplicates on refresh
    const existingBooking = await Booking.findOne({ listing: id, user: userId, status: 'confirmed' });

    if (existingBooking) {
        req.flash("success", "Listing already booked!");
        return res.redirect(`/listings/${id}`);
    }

    try {
        const newBooking = new Booking({
            listing: id,
            user: userId,
            // Assuming we don't have the final paymentIntentId yet without webhooks
            // In a real app, this should only run after webhook confirmation.
        });

        await newBooking.save();
        req.flash("success", "Booking confirmed successfully!");
        res.redirect(`/listings/${id}`);
    } catch (e) {
        console.error("Booking Confirmation Error:", e);
        req.flash("error", "Error finalizing booking.");
        res.redirect(`/listings/${id}`);
    }
};

// 1. Initiates the Stripe Payment Intent and renders the checkout form
module.exports.createPaymentIntent = async(req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect(`/listings/${id}`);
    }

    try {
        // Stripe uses the smallest currency unit ( paise for INR)
        const amountInPaise = Math.round(Number(listing.price) * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInPaise,
            currency: 'inr', // Set your currency
            metadata: { listing_id: id, buyer_id: req.user._id.toString() },
            // Set the automatic payment method collection
            automatic_payment_methods: {
                enabled: true,
            },
        });

        // Send the client secret to the client (frontend)
        res.render("listings/checkout", {
            clientSecret: paymentIntent.client_secret,
            listing: listing,
            priceInPaise: amountInPaise
        });

    } catch (e) {
        console.error("Stripe Error in createPaymentIntent:", e.message);
        req.flash("error", "Payment processing failed. Try again later.");
        res.redirect(`/listings/${id}`);
    }
};


// 2. Records the booking in the database after successful client-side payment confirmation
module.exports.recordBooking = async(req, res) => {
    const { id } = req.params; // Listing ID
    const userId = req.user._id;
    const { paymentIntentId } = req.body;

    // Prevent duplicate bookings on AJAX retries
    const existingBooking = await Booking.findOne({
        listing: id,
        user: userId,
        status: 'confirmed'
    });

    if (existingBooking) {
        return res.status(200).json({ status: "already_booked" });
    }

    try {
        const newBooking = new Booking({
            listing: id,
            user: userId,
            paymentIntentId: paymentIntentId,
            status: 'confirmed'
        });

        await newBooking.save();
        // Respond with success status to the client
        res.status(200).json({ status: "success" });
    } catch (e) {
        console.error("Booking Recording Error:", e.message);
        // Respond with an internal server error status
        res.status(500).json({ status: "error", message: "Failed to save booking to database." });
    }
};