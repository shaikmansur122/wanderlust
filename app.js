const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/expressError");

// --------------------
// ROUTES
// --------------------
const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/reviews");

// --------------------
// DATABASE
// --------------------
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// --------------------
// APP CONFIG
// --------------------
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// --------------------
// ROUTE MOUNTING
// --------------------
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);

// --------------------
// 404 HANDLER (Express 5 SAFE)
// --------------------
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// --------------------
// ERROR HANDLER
// --------------------
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).send(message);
});

// --------------------
app.listen(8080, () => {
  console.log("Server running on port 8080");
});
