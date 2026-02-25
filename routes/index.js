const { Router } = require("express");
const passport = require("passport");
const {
  getIndex,
  getSignUp,
  postSignUp,
  logOut,
} = require("../controllers/authController");
const { signUpValidators } = require("../middleware/validators");

const router = Router();

// home
router.get("/", getIndex);

// signup
router.get("/sign-up", getSignUp);
router.post("/sign-up", signUpValidators, postSignUp);

// login
router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  }),
);

// logout
router.get("/log-out", logOut);

module.exports = router;
