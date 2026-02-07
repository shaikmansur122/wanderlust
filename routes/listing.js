const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../schema");
const { isLoggedIn, isListingOwner } = require("../middleware");
const listingController = require("../controllers/listingController");

const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

// --------------------
// VALIDATION
// --------------------
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, msg);
  }
  next();
};

// --------------------
// INDEX & CREATE
// /listings
// --------------------
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("image"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

// --------------------
// NEW FORM
// --------------------
router.get("/new", isLoggedIn, listingController.renderNewForm);

// --------------------
// SHOW, UPDATE, DELETE
// /listings/:id
// --------------------
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isListingOwner,
    upload.single("image"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedIn,
    isListingOwner,
    wrapAsync(listingController.deleteListing)
  );

// --------------------
// EDIT FORM
// --------------------
router.get(
  "/:id/edit",
  isLoggedIn,
  isListingOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
