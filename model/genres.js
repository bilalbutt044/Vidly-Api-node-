const Joi = require('joi');
const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
});

const Genre = mongoose.model(
  "Genre",
  genreSchema
);

function validateGenre(genre) {
  const schema = {
    name: Joi.string()
      .min(5)
      .required()
  };
  return Joi.validate(genre, schema);
}

function validateGenreId(genreId) {
  const schema = {
    id: Joi.objectId()
      .required()
  };
  return Joi.validate(genreId, schema);
}

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validateId = validateGenreId;
exports.validate = validateGenre;