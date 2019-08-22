const auth = require('../middleware/auth');
const express = require("express");
const router = express.Router();
const { validate, validateId ,Movie } = require("../model/movies");
const { Genre } = require("../model/genres");

// get all
router.get("/", async (req, res) => {
  const movie = await Movie.find()
    .populate("movie", "name -_id")
    .sort("name");
  res.status(200).send(movie);
});

// get one
router.get("/:id", async (req, res) => {
  const  result  = validateId({id: req.params.id});
  if (result.error) return res.status(400).send(result.error.details[0].message);

  const movie = await Movie.findById(req.params.id)
    .populate("movie", "name -_id")
    .sort("name");
  if (!movie) res.status(404).send("the movie with given id was not found");

  res.status(200).send(movie);
});

// add
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  console.log("Joi error ", error);

  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre");

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });
  await movie.save();
  res.status(200).send(movie);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre");

  const  result  = validateId({id: req.params.id});
  if (result.error) return res.status(400).send(result.error.details[0].message);

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: { _id: genre._id, name: genre.name },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    },
    { new: true }
  );

  res.send(movie);
});

router.delete("/:id",auth, async (req, res) => {
  const  result  = validateId({id: req.params.id});
  if (result.error) return res.status(400).send(result.error.details[0].message);

  const movie = await Movie.findByIdAndRemove(req.params.id);
  res.send(movie);  
});

module.exports = router;
