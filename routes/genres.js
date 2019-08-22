const asyncMiddleware = require('../middleware/async');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const mongoos = require('mongoose');
const express = require("express");
const router = express.Router();
const { validate, validateId, Genre } = require('../model/genres');

// get all
router.get("/", asyncMiddleware(async (req, res) => {
  const genre = await Genre.find().sort("name");
  res.status(200).send(genre);
}));

// get one
router.get("/:id", asyncMiddleware(async (req, res) => {
  const  result  = validateId({id: req.params.id});
  if (result.error) return res.status(400).send(result.error.details[0].message);

  const genre = await Genre.findById(req.params.id);
  if (!genre) res.status(404).send("the genre with given id was not found");

  res.status(200).send(genre);
}));

// add
router.post("/",auth, asyncMiddleware(async (req, res) => {
  const { error } = validate(req.body);
  console.log("Joi error ", error);

  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();
  res.status(200).send(genre);
}));

router.put("/:id", auth, asyncMiddleware(async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const  result  = validateId({id: req.params.id});
  if (result.error) return res.status(400).send(result.error.details[0].message);
  
    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name
      },
      { new: true }
    );

    res.send(genre);
  
}));

router.delete("/:id", [auth, admin] , asyncMiddleware(async (req, res) => {
  const  result  = validateId({id: req.params.id});
  if (result.error) return res.status(400).send(result.error.details[0].message);
  
    const genre = await Genre.findByIdAndRemove(req.params.id);
    res.send(genre);

}));


module.exports = router;
