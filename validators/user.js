const register = (req, res, next) => {
  // Name
  req.check("name", "Please enter a name").notEmpty();
  // Email
  req.check("email", "Please enter a email").notEmpty();
  // Password
  req.check("password", "Please enter a password").notEmpty();
  req
    .check("password", "password should be atleast 6 words long")
    .isLength({
      min: 6,
      max: 20
    });
  // Check for errors
  const errors = req.validationErrors();

  // If error show the first one as they happens
  if (errors) {
    const firstError = errors.map(e => e.msg)[0];
    return res.status(400).json({ error: firstError });
  }

  // Procceed to next midleware
  next();
};

const login = (req, res, next) => {
  // Email
  req.check("email", "Please enter a email").notEmpty();
  // Password
  req.check("hashed_password", "Please enter a password").notEmpty();
  req
    .check("hashed_password", "password should be atleast 6 words long")
    .isLength({
      min: 6,
      max: 20
    });
  // Check for errors
  const errors = req.validationErrors();

  // If error show the first one as they happens
  if (errors) {
    const firstError = errors.map(e => e.msg)[0];
    return res.status(400).json({ error: firstError });
  }

  // Procceed to next midleware
  next();
};

module.exports = { register, login };
