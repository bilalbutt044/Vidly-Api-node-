const { Customer, validate, validateId } = require('../model/customers');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
router.get('/', async (req, res) => {
    
    const customers = await Customer.find().sort('name');
    res.send(customers)
}) 

router.get("/:id", async (req, res) => {
    const  result  = validateId({id: req.params.id});
    if (result.error) return res.status(400).send(result.error.details[0].message);
    
  
    const customer =  await Customer.findById(req.params.id);
    if(!customer) return res.status(404).send("Customer with the given id was not found");
    res.send(customer);
})

router.post('/', async (req, res) => {
    const { error} = validate(req.body);
    console.log(error);
    if(error) return res.status(400).send(error);

    let customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    })

    customer = await customer.save();
    res.send(customer);
})

module.exports = router