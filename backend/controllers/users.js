const User = require("../models/user");

//SignUp
module.exports.signup = async (req, res, next) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });

      let registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        res.status(201).json({
          message: "Welcome to HostHive!",
          user: {
            _id: registeredUser._id,
            username: registeredUser.username,
            email: registeredUser.email
          }
        });
      });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
};

//Login
module.exports.login = async (req, res) => {
  res.json({
    message: "Welcome back to HostHive!",
    user: {
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email
    }
  });
};

//Logout
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.json({ message: "Logged you out successfully!" });
    });
};

//Get Current User
module.exports.getCurrentUser = (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      user: {
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email
      }
    });
  } else {
    res.json({ user: null });
  }
};