const helmet = require("helmet");
const express = require("express");
const users = require('../routes/users');
const auth = require('../routes/auth');
const customers = require('../routes/customers');
const genres = require("../routes/genres");
const movies = require("../routes/movies");
const rentals = require("../routes/rental");
const error = require('../middleware/error');


module.exports = function(app) {
    app.use("/api/customers", customers);
    app.use("/api/genres", genres);
    app.use("/api/movies", movies);
    app.use("/api/rentals", rentals);
    app.use("/api/users", users);
    app.use("/api/auth", auth);
    app.use(error);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(helmet());

}