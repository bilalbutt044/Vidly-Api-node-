const config = require("config");
const morgan = require("morgan");
const helmet = require("helmet");
const express = require("express");
const app = express();
const log = require("./middleware/logger");
const customers = require('./routes/customers');
const genres = require("./routes/genres");
const mongoose = require("mongoose");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());
app.use("/api/customers", customers);
app.use("/api/genres", genres);
app.use(log);

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
