const mongoose = require('mongoose');
const Joi = require('joi');

const User = mongoose.model('Login', new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
      },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    }
}));

function validateUser(user) {
    const schema = {
        username: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required(),
        email: Joi.string().min(5).max(255).required().email()
    }

    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;