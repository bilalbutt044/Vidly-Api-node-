const mongoose = require("mongoose");
const Joi = require("joi"); 
Joi.objectId = require('joi-objectid')(Joi);

const Rental = mongoose.model(
  "Rental",
  new mongoose.Schema({
    customer: {
      type: new mongoose.Schema({
        name: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 250
        },
        isGold: {
          type: Boolean,
          default: false
        },
        phone: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50
        }
      }),
      required: true
    },
    movie: {
      type: new mongoose.Schema({
        title: {
          type: String,
          required: true,
          trim: true,
          minlength: 5,
          maxlength: 50
        },
        dailyRentalRate: {
          type: Number,
          required: true,
          minlength: 0,
          maxlength: 255
        }
      }),
      required: true
    },
    dateOut: {
      type: Date,
      require: true,
      default: Date.now
    },
    dateReturned: {
      type: Date
    },
    rentalFee: {
      type: Number,
      min: 0
    }
  })
);

function validateRental(rental) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  };
  return Joi.validate(rental, schema);
}


function validateRentalId(rentalId) {
  const schema = {
    id: Joi.objectId().required()
  };
  return Joi.validate(rentalId, schema);
}

exports.Rental = Rental;
exports.validate = validateRental;
exports.validateId = validateRentalId;
