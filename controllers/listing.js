const axios = require("axios");
const Listing = require("../models/listing");

module.exports.index = async(req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
};

module.exports.renderNewListing = (req, res) => {
    res.render("listings/new");
};

module.exports.showListing = async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "The listing you requested for doesn't exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show", { listing });
};
module.exports.createListing = async(req, res, next) => {
    try {
        const { location, country } = req.body.listing;

        // Geoapify request with timeout
        let coords = null;
        try {
            const geoRes = await axios.get("https://api.geoapify.com/v1/geocode/search", {
                params: {
                    text: `${location}, ${country}`,
                    apiKey: process.env.MAP_TOKEN,
                },
                timeout: 5000, // 5 seconds timeout
            });

            if (geoRes.data.features && geoRes.data.features.length > 0) {
                coords = geoRes.data.features[0].geometry.coordinates;
            } else {
                console.warn("⚠️ No coordinates found for:", location, country);
            }
        } catch (geoErr) {
            console.error("Geoapify request failed:", geoErr.message);
            req.flash("error", "Could not fetch coordinates. Listing will still be saved without geometry.");
        }

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;

        // Attach image if present
        if (req.file) {
            newListing.image = {
                url: req.file.path,
                filename: req.file.filename,
            };
        }

        // Attach geometry if Geoapify returned coordinates
        if (coords) {
            newListing.geometry = {
                type: "Point",
                coordinates: coords,
            };
        }

        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    } catch (err) {
        console.error("Error creating listing:", err.message);
        req.flash("error", "Error creating listing!");
        res.redirect("/listings/new");
    }
};


module.exports.renderEditListing = async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit", { listing, originalImageUrl });
};

module.exports.updateListing = async(req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, {...req.body.listing }); //destructuring 

    try {
        // Forward Geocoding with Geoapify
        const location = req.body.listing.location;
        const country = req.body.listing.country;

        const geoRes = await axios.get("https://api.geoapify.com/v1/geocode/search", {
            params: {
                text: `${location}, ${country}`,
                apiKey: process.env.MAP_TOKEN,
            },
        });

        if (geoRes.data.features && geoRes.data.features.length > 0) {
            const coords = geoRes.data.features[0].geometry.coordinates; // [lon, lat]

            listing.geometry = {
                type: "Point",
                coordinates: coords,
            };
        } else {
            console.warn("⚠️ No coordinates found for:", location, country);
        }

        // Handle image updates
        if (typeof req.file !== "undefined") {
            listing.image = {
                url: req.file.path,
                filename: req.file.filename,
            };
        }

        await listing.save();
        req.flash("success", "Listing Updated!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error("Geoapify Geocoding Error:", err.message);
        req.flash("error", "Could not update coordinates. Try again later.");
        res.redirect(`/listings/${id}`);
    }
};


module.exports.destroyListing = async(req, res) => {
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
};