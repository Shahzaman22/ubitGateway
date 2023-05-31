// GOOGLE OAUTH
const express = require("express");
const router = express.Router();
require("../middleware/googleOauth");
const passport = require("passport");
const { User } = require('../model/user');

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/api/auth/protected",
    failureRedirect: "/api/auth/failure",
  })
);

router.get("/failure", (req, res) => {
  res.send("something went wrong..");
});

router.get("/protected", [isLoggedIn], async (req, res) => {
  try {
    // Check if the user already exists in your database
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      // If the user does not exist, create a new user with Google OAuth details
      const newUser = new User({
        name: req.user.displayName,
        email: req.user.email,
        role: "default", // Assign a default role for Google OAuth users
      });
      console.log("newUser =>",newUser);
      console.log("User =>",user);
      await newUser.save();
      res.json(`Hello ${newUser.name}. You are Logged In`);
    } else {
      // If the user already exists, return the user details
      res.json(`Hello ${user.name}. You are Logged In`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      }
      res.send("Goodbye");
    });
  });
});

module.exports = router;
