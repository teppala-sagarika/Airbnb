const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

//Index Route
router.get("/", wrapAsync(async(req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));

//New Route 
//(u need to create it above the show route bcoz it consideres 'new' as an 'id')
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new");
});

//Show Route
router.get("/:id", wrapAsync(async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "The listing you requested for doesn't exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show", { listing });
}));

//Post/Create Route
router.post("/", isLoggedIn, validateListing, wrapAsync(async(req, res, next) => {
    let listing = req.body.listing;
    listing.price = Number(listing.price);
    const newListing = new Listing(listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
}));

//Update Route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async(req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing }); //destructuring
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

router.delete("/:id", isLoggedIn, isOwner, async(req, res) => {
    try {
        const { id } = req.params;
        const deletedListing = await Listing.findByIdAndDelete(id);
        if (!deletedListing) {
            console.log("Listing not found, but redirecting anyway");
        }
    } catch (err) {
        console.log("Error during deletion:", err);
    }
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
});

module.exports = router;