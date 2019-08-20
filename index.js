const Joi = require("joi"); 
Joi.objectId = require('joi-objectid')(Joi);
const config = require("config");
const morgan = require("morgan");
const helmet = require("helmet");
const express = require("express");
const app = express();
const log = require("./middleware/logger");
const users = require('./routes/users');
const auth = require('./routes/auth');
const customers = require('./routes/customers');
const genres = require("./routes/genres");
const movies = require("./routes/movies");
const rentals = require("./routes/rental");
const mongoose = require("mongoose");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());
// app.use(log);

app.use("/api/customers", customers);
app.use("/api/genres", genres);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to mongodb"))
  .catch(err => console.log("Could not connect to mongodb", err));

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  console.log("morgan is running...");
}

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));
