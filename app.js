const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utilities/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

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

const sessionOptions = {
    secret: "bekindtoeveryone",
    resave: false,
    saveUninitialized: true,
};

app.get("/", (req, res) => {
    res.send("Hi,I am Root!!");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware
app.use((req, res, next) => {
    const success = req.flash("success").filter(msg => msg.trim().length > 0);
    const error = req.flash("error").filter(msg => msg.trim().length > 0);
    res.locals.success = success;
    res.locals.error = error;
    res.locals.currUser = req.user;
    next();
});


// app.get("/demoUser", async(req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "randomstudent",
//     });
//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


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