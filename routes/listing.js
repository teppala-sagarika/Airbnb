const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const { detectCategory } = require("../utilities/categoryDetect");

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));

//New Route 
//(u need to create it above the show route bcoz it consideres 'new' as an 'id')
router.get("/new", isLoggedIn, listingController.renderNewListing);

//category
router.get("/category/:category", async(req, res) => {
    const { category } = req.params;
    const listings = await Listing.find({ category }); // Fetch from DB
    res.render("listings/index", { allListings: listings });
});

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditListing));

module.exports = router;