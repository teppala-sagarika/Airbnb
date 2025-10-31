const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utilities/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router.get("/signup", userController.renderSignUpForm);

router.post("/signup", wrapAsync(userController.signUp));

router.get("/login", userController.renderLoginForm);

// passport will delete our req.session.redirectUrl while /login so we save it in locals
// passport cant delete info from locals
router.post(
    "/login", saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: "Invalid username or password.",
    }), userController.login
);

router.get("/logout", userController.logout);

module.exports = router;