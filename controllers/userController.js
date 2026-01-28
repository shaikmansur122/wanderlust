const User = require("../models/user");

// --------------------
// RENDER SIGNUP FORM
// --------------------
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup");
};


// --------------------
// SIGNUP LOGIC
// --------------------
module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);

    // Auto login after signup
    req.login(registeredUser, err => {
      if (err) return next(err);

      req.flash("success", "Welcome to Wanderlust!");
      res.redirect(res.locals.redirectUrl || "/listings");
    });

  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};


// --------------------
// RENDER LOGIN FORM
// --------------------
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};


// --------------------
// LOGIN SUCCESS
// --------------------
module.exports.login = (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};


// --------------------
// LOGOUT
// --------------------
module.exports.logout = (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);

    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
  });
};
