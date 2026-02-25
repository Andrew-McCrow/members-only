const bcrypt = require("bcryptjs");
const { createUser } = require("../db/queries");

function getIndex(req, res) {
  res.render("index", { user: req.user });
}

function getSignUp(req, res) {
  res.render("sign-up-form");
}

async function postSignUp(req, res, next) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await createUser(req.body.name, req.body.email, hashedPassword);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
}

function logOut(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

module.exports = { getIndex, getSignUp, postSignUp, logOut };
