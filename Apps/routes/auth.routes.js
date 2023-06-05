//GOOGLE OAUTH
const express = require("express");
const router = express.Router();
require("../middleware/googleOauth");
const passport = require("passport");

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

router.get("/protected", [isLoggedIn], (req, res) => {
  res.json(`Hello ${req.user.name}. You are Logged In, Your email is ${req.user.email} and your role is ${req.user.role}`);
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
