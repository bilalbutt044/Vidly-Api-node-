const auth = require('../middleware/auth');
const config = require('config');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const mongoos = require("mongoose");
const express = require("express");
const router = express.Router();
const { validate, User } = require("../model/users");

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user)
})


router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user  = await User.findOne({ email: req.body.email});
    if(user) return res.status(400).send('User already register');


    user = new User(_.pick(req.body, ['username','password','email']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['username', 'email']));
 
});


module.exports = router;