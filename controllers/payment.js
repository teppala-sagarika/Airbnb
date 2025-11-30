const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Listing = require('../models/listing'); // Assuming this path

module.exports.createPaymentIntent = async(req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
    }

    try {
        // Stripe uses the smallest currency unit (paise for INR).
        const amountInPaise = Math.round(listing.price * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInPaise,
            currency: 'inr',
            metadata: { listing_id: id, buyer_id: req.user._id.toString() },
        });
        res.render("listings/checkout", {
            clientSecret: paymentIntent.client_secret,
            listing: listing,
            priceInPaise: amountInPaise
        });
    } catch (e) {
        console.error("Stripe Error:", e);
        req.flash("error", "Payment processing failed. Try again later.");
        res.redirect(`/listings/${id}`);
    }
};