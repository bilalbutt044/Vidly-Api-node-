const Joi = require('joi');
const mongoose = require('mongoose');

const Customer =  mongoose.model("Customer", new mongoose.Schema({
    isGold: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
}));

function validateCustomer(customer) {
    const schema = {
        isGold: Joi.boolean().required(),
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required()
    }
    return Joi.validate(customer, schema);
}

function validateCustomerId(customerId) {
    const schema = {
        id: Joi.objectId().required()
    }
    return Joi.validate(customerId, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
exports.validateId = validateCustomerId;