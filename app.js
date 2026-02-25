// import dependencies
require("dotenv").config();
const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { getUserByEmail, getUserById } = require("./db/queries");
const routes = require("./routes/index");

// Set up Express app
const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// Set up Passport.js
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

// Passport.js configuration
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (username, password, done) => {
      try {
        const user = await getUserByEmail(username);

        if (!user) {
          return done(null, false, { message: "Incorrect email" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

// Serialize and deserialize user instances to and from the session.
passport.serializeUser((user, done) => {
  done(null, user.id);
});
// Deserialize user by ID from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Middleware to make the user object available in all views
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Routes
app.use("/", routes);

// listen for requests
app.listen(3000, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port 3000!");
});
