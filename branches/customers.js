const express = require('express');
const { Customers, validate, validateStrict } = require('../models/customer');
const router = express.Router();

// Retrieve customers
router.get('/', async (req, res) => {
    try {
        res.send(await Customers.find().sort('name').limit(100));
    } catch(err) {
        res.status(404).send('Error: ' + err.message)
    }
})

router.get('/:id', async (req, res) => {
    try {
        res.send(await Customers.find({ id: req.params.id }));
    } catch(err) {
        res.status(404).send('Error: ' + err.message)
    }
})

// Upload a new customer
router.post('/', async (req, res) => {
    // validation with Joi
    const { error } = validateStrict(req.body);
    if(error) { return res.status(400).send(error.message) }

    // upload data to mongodb database
    try {
        const newCustomer = new Customers({
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold || false,
        });

        res.send(await newCustomer.save());
        console.log(newCustomer)
    } catch(err) {
        res.status(400).send('Error: ' + err.message)
    }
})


// Update current customer
router.put('/:id', async (req, res) => {
    // validation with Joi
    const { error } = validate(req.body);
    if(error) { return res.status(400).send(error.message) }

    
    // update and upload data to mongodb database
    try {
        let customer = await Customers.findOne({ id: req.params.id });

        if(req.body.name) { customer.name = req.body.name }
        if(req.body.phone) { customer.phone = req.body.phone }     
        if(req.body.isGold) { customer.isGold = req.body.isGold }             

        customer.save();
        res.send(customer);
    } catch(err) {
        res.status(404).send('Error: ' + err.message)
    }
})

// Delete customer
router.delete('/:id', async (req, res) => {
    let customer = await Customers.findOneAndDelete({ id: req.params.id })
    res.send(customer);
    console.log(customer);
})

// Export the router object for index.js to use this as middleware
module.exports = router;