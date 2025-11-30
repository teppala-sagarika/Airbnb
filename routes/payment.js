const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utilities/wrapAsync.js");
const paymentController = require("../controllers/payment.js");
const { isLoggedIn } = require("../middleware.js");

//initiate the payment process for a specific listing
router.post("/:id/checkout", isLoggedIn, wrapAsync(paymentController.createPaymentIntent));

// redirects to after successful payment
router.get("/:id/booked", isLoggedIn, wrapAsync(paymentController.confirmBooking));

module.exports = router;