// dependency imports
const bcrypt = require("bcryptjs");
const { createUser, updateMemberStatus } = require("../db/queries");
const { validationResult } = require("express-validator");

// Render the home page
function getIndex(req, res) {
  res.render("index", { user: req.user });
}
// Render the sign-up form
function getSignUp(req, res) {
  res.render("sign-up-form", { errors: {}, formData: {} });
}

// Handle sign-up form submission
async function postSignUp(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("sign-up-form", {
      errors: errors.mapped(),
      formData: req.body,
    });
  }
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await createUser(req.body.name, req.body.email, hashedPassword);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
}
// Handle user logout
function logOut(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

// Render the join-club page
function getJoinClub(req, res) {
  res.render("join-club", { error: null });
}

// Handle join-club form submission
async function postJoinClub(req, res, next) {
  const { passcode } = req.body;
  if (passcode !== process.env.PASSCODE) {
    return res.status(400).render("join-club", { error: "Incorrect passcode. Try again!" });
  }
  try {
    await updateMemberStatus(req.user.id, "in_da_club");
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
}

module.exports = { getIndex, getSignUp, postSignUp, logOut, getJoinClub, postJoinClub };
