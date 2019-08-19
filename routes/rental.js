const express = require("express");
const router = express.Router();
const mongoos = require("mongoose");
const Fawn = require("fawn");

const { Movie } = require("../model/movies");
const { Customer } = require("../model/customers");
const { validate, validateId, Rental } = require("../model/rentals");

Fawn.init(mongoos);

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.status(200).send(rentals);
});

router.get("/:id", async (req, res) => {
  const result = validateId({ id: req.params.id });
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const rental = await Rental.findById(req.params.id)
    .populate("rental", "name -_id")
    .sort("name");
  if (!rental) res.status(404).send("the rental with given id was not found");

  res.status(200).send(rental);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie");

  if (movie.numberInStock === 0) return res.status(400).send("Movie not found");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 }
        }
      )
      .run();

    res.status(200).send(rental);
  } catch (ex) {
    res.status(500).send("something failed");
  }
});

// router.put("/:id", async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const genre = await Genre.findById(req.body.genreId);
//   if (!genre) return res.status(400).send("Invalid genre");

//   const result  = validateId({id: req.params.id});
//   if (result.error) return res.status(400).send(result.error.details[0].message);

//     const rental = await Rental.findByIdAndUpdate(
//       req.params.id,
//       {
//         title: req.body.title,
//         genre: { _id: genre._id, name: genre.name },
//         numberInStock: req.body.numberInStock,
//         dailyRentalRate: req.body.dailyRentalRate
//       },
//       { new: true }
//     );

//     res.send(rental);

// });

router.delete("/:id", async (req, res) => {
  const result = validateId({ id: req.params.id });
  if (result.error)
    return res.status(400).send(result.error.details[0].message);
  const rental = await Rental.findByIdAndRemove(req.params.id);
  res.send(rental);
});

module.exports = router;
