require("dotenv").config();
console.log("ENV CHECK:");
console.log(process.env.CLOUD_NAME);
console.log(process.env.CLOUD_API_KEY);
console.log(process.env.CLOUD_API_SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
console.log(typeof LocalStrategy);
const User = require("./models/user.js");



const ExpressError = require("./utils/expressError");

// --------------------
// ROUTES
// --------------------
const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/user.js");

// --------------------
// DATABASE
// --------------------
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

mongoose.connect(MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

// --------------------
// APP CONFIG
// --------------------
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "devsecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly: true
  },
};

app.use(session(sessionOptions));
app.use(flash());

  // --------------------
// AUTENTICATION
// --------------------

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 



app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");   
  res.locals.currentUser = req.user;       
  next();
});


// --------------------
// ROUTE MOUNTING
// --------------------
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

// --------------------
// 404 HANDLER
// --------------------
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// --------------------
// ERROR HANDLER
// --------------------
app.use((err, req, res, next) => {
  console.error("🔥 REAL ERROR:", err); 
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode);
  res.render("error", { message });
});


// --------------------
app.listen(8080, () => {
  console.log("Server running on port 8080");
});
