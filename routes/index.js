const { Router } = require("express");
const passport = require("passport");
const {
  getIndex,
  getSignUp,
  postSignUp,
  logOut,
  getJoinClub,
  postJoinClub,
} = require("../controllers/authController");
const { getNewMessage, postNewMessage, deleteMessageHandler } = require("../controllers/messagesController");
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

// join club
router.get("/join-club", getJoinClub);
router.post("/join-club", postJoinClub);

// messages
router.get("/new-message", getNewMessage);
router.post("/new-message", postNewMessage);
router.post("/messages/:id/delete", deleteMessageHandler);

module.exports = router;
