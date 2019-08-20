const _ = require('lodash');
const Joi = require('joi')
const bcrypt = require('bcrypt');
const mongoos = require("mongoose");
const express = require("express");
const router = express.Router();
const { User } = require("../model/users");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user  = await User.findOne({ email: req.body.email});
    if(!user) return res.status(400).send('Invalid email or passsword');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or passsword');

    res.send(true); 
});

function validate(user) {
    const schema = {
        password: Joi.string().min(5).max(255).required(),
        email: Joi.string().min(5).max(255).required().email()
    }

    return Joi.validate(user, schema);
}

module.exports = router;