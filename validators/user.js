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
  const message = req.validationErrors();

  // If error show the first one as they happens
  if (message) {
    const regError = message.map(e => e.msg)[0];
    return res.status(400).json({ message: regError, status: false });
  }

  // Procceed to next midleware
  next();
};

const login = (req, res, next) => {
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
  const message = req.validationErrors();
  // If error show the first one as they happens
  if (message) {
    const logError = message.map(e => e.msg)[0];
    return res.status(400).json({ message: logError, status: false });
  }

  // Procceed to next midleware
  next();
};

module.exports = { register, login };
