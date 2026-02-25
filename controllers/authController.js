// dependency imports
const bcrypt = require("bcryptjs");
const { createUser } = require("../db/queries");
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

module.exports = { getIndex, getSignUp, postSignUp, logOut };
