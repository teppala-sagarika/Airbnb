const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/wrapAsync.js");
const ExpressError = require("../utilities/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

//middleware
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

//Index Route
router.get("/", wrapAsync(async(req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));

//New Route 
//(u need to create it above the show route bcoz it consideres 'new' as an 'id')
router.get("/new", (req, res) => {
    res.render("listings/new");
});

//Show Route
router.get("/:id", wrapAsync(async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        req.flash("error", "The listing you requested for doesn't exist!");
        res.redirect("/listings");
    }
    res.render("listings/show", { listing });
}));

//Post/Create Route
router.post("/", validateListing, wrapAsync(async(req, res, next) => {
    console.log(req.body);
    let listing = req.body.listing;
    listing.price = Number(listing.price);
    const newListing = new Listing(listing);
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit", wrapAsync(async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
}));

//Update Route
router.put("/:id", validateListing, wrapAsync(async(req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing }); //destructuring
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

// //Delete Route

// router.delete("/listings/:id", wrapAsync(async(req, res, next) => {
//     const { id } = req.params;
//     const deleted = await Listing.findByIdAndDelete(id);
//     if (!deleted) {
//         throw new ExpressError(404, "Listing not found");
//     }
//     res.redirect("/listings");
// }));

router.delete("/:id", async(req, res) => {
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