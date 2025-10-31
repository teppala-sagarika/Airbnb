const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");

//Index Route
router.get("/", wrapAsync(listingController.index));

//New Route 
//(u need to create it above the show route bcoz it consideres 'new' as an 'id')
router.get("/new", isLoggedIn, listingController.renderNewListing);

//Show Route
router.get("/:id", wrapAsync(listingController.showListing));

//Post/Create Route
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditListing));

//Update Route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

//Delete Route
router.delete("/:id", isLoggedIn, isOwner, listingController.destroyListing);

module.exports = router;