var router = require("express").Router();
const passport = require("passport");

// If url is localhost:3000, Redirect to localhost:3000/home
router.get("/", function (req, res) {
  res.redirect("/home");
});

// Render Login Page
router.get("/home", function (req, res) {
  res.render("home");
});

// Google OAuth login route
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback route
router.get(
  "/oauth2callback",
  passport.authenticate("google", {
    successRedirect: "/budgets",
    failureRedirect: "/home",
  })
);

// OAuth logout route
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/home");
});

module.exports = router;
