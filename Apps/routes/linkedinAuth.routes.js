const express = require("express");
const router = express.Router();
require("../middleware/linkedinOauth");
const passport = require("passport");
const { User } = require("../model/user");

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

router.get("/linkedin", passport.authenticate("linkedin"));

router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", {
    successRedirect: "/api/auth/dashboard",
    failureRedirect: "/api/auth/failure",
  })
);

router.get("/failure", (req, res) => {
  res.json({ error: "Something went wrong" });
});

router.get("/dashboard", [isLoggedIn], async (req, res) => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (error) {
    res.json({ error: error.message });
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
      res.json("Goodbye");
    });
  });
});

module.exports = router;
