const { Router } = require("express");
const router = Router();

const jwt = require('jsonwebtoken');
const config = require('../config');

const User = require("../models/User");

router.post("/signup", async (req, res, next) => {
  const { username, email, password } = req.body;
  const user = new User({
    username,
    email,
    password
  });
  await user.save();
  user.password = await user.encryptPassword(user.password);

  const token = jwt.sign({id: user._id}, config.secret, {
    expiresIn: 60 * 60 * 24
  })
  
  res.json({auth: true, token});
});

router.post("/signin", (req, res, next) => {
  res.json("signin");
});

router.get("/me", async (req, res, next) => {

  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).json({
      auth: false,
      message: 'No token provided'
    });
  }

  const decoded = jwt.verify(token, config.secret);
  
  const user = await User.findById(decoded.id, { password: 0 });
  if (!user) {
    return res.status(404).send('No user found');
  }

  res.json(user);
});

module.exports = router;
