const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utilities/wrapAsync.js");
const ExpressError = require("./utilities/ExpressError.js");
const { listingSchema } = require("./schema.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

app.engine("ejs", ejsMate);

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust"

main().then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
    res.send("Hi,I am Root!!");
});

//middleware
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.msg).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

//Index Route
app.get("/listings", wrapAsync(async(req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));

//New Route 
//(u need to create it above the show route bcoz it consideres 'new' as an 'id')
app.get("/listings/new", (req, res) => {
    res.render("listings/new");
});

//Show Route
app.get("/listings/:id", wrapAsync(async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show", { listing });
}));

//Post/Create Route
app.post("/listings", validateListing, wrapAsync(async(req, res, next) => {
    // try {
    let listing = req.body.listing;
    const newListing = new Listing(listing);
    await newListing.save();
    res.redirect("/listings");
    // } catch (err) {
    //     next(err);
    // }
}));

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
}));

//Update Route
app.put("/listings/:id", validateListing, wrapAsync(async(req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing }); //destructuring
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id", wrapAsync(async(req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

// app.get("/testListing", async(req, res) => {
//     let sample = new Listing({
//         title: "My home",
//         description: "A happy place",
//         price: 3000,
//         location: "Vizag",
//         country: "India"
//     });
//     await sample.save();
//     console.log("data saved");
//     res.send("The test was successful");
// });

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

//error handling middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, msg = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { msg });
    // res.status(statusCode).send(msg);
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});