const mongoose = require("mongoose");

module.exports = function() {
    mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to mongodb"))
  .catch(err => console.log("Could not connect to mongodb", err));

}