const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const userController = require("../controllers/users");

router.post("/signup", wrapAsync(userController.signup));

router.post("/login", saveRedirectUrl, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ error: info ? info.message : "Authentication failed" });
    }
    req.login(user, (err) => {
      if (err) return next(err);
      return userController.login(req, res);
    });
  })(req, res, next);
});

router.post("/logout", userController.logout);
router.get("/currUser", userController.getCurrentUser);

module.exports = router;
