const express = require('express');
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Joi = require('joi');
const router = express.Router();


// Schema - mongoDB
const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
        minlength: 5,
        maxlength: 255,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        match: /^[0-9]+$/,
        trim: true,
        minlength: 5,
        maxlength: 20
    },
    isGold: {
        type: Boolean,
        required: true
    }
});
// auto increment
customerSchema.plugin(AutoIncrement, {inc_field: 'id'});

// Model - MongoDB
const Customers = mongoose.model('Customers', customerSchema, 'customers')


// Retrieve customers
router.get('/', async (req, res) => {
    try {
        return await Customers.find();
    } catch(err) {
        res.status(400).send('Error: ' + err.message)
    }
})

// Upload a new customer
router.post('/', async (req, res) => {
    // validation with Joi
    const { error } = validateCustomerStrict(req.body);
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
    const { error } = validateCustomer(req.body);
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


// validation functions
function validateCustomerStrict(input) {
    const schema = Joi.object({
        name: Joi.string().required().min(5).max(255),
        phone: Joi.string().required().min(5).max(20),
        isGold: Joi.boolean()
    });

    return schema.validate(input)
}

function validateCustomer(input) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(255),
        phone: Joi.string().min(5),
        isGold: Joi.boolean()
    });

    return schema.validate(input)
}

// Export the router object for index.js to use this as middleware
module.exports = router;