const bcrypt = require("bcryptjs");
const passport = require("passport");
// Load User model
const User = require("../models/register");

//Login Function
exports.login = (req, res) =>
  res.render("login");

//Handle post request to Login a user
exports.loginUser = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login",
    failureFlash: true
  })(req, res, next);
};

// Logout already logined user
exports.logout = (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/login");
};