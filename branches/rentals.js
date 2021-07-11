const express = require('express');
const mongoose = require('mongoose');
const { Customers } = require('../models/customer');
const { Movies } = require('../models/movie')
const { Rentals, validate } = require('../models/rental');
const router = express.Router();

router.get('/', async (req, res) => {
    const rentals = await Rentals.find().sort({ dateOut: -1 })
    res.send(rentals);
})

router.post('/', async (req, res) => {
    // validate input
    const {err} = validate(req.body.id);
    if(err) return res.status(400).send(err.message)

    // Find customer by customerId
    const customer = await Customers.findById(req.body.customerId);
    if(!customer) return res.status(400).send(`Customer with the ID ${req.body.customerId} is not found`)

    // Find movie by movieId
    const movie = await Movies.findById(req.body.movieId);
    if(!movie) return res.status(400).send(`Movie with the ID ${req.body.movieId} is not found`)

    if(movie.numberInStock <= 0) return res.status(400).send('Movie out of stock')

    // Write the rental data object with data we have found
    const newRental = new Rentals({
        // For linked properties, we reference back to its parent object
        customer: {
            name: customer.name,
            phone: customer.phone,
            isGold: customer.isGold
        },
        movie: {
            title: movie.title,
            numberInStock: movie.numberInStock,
            dailyRentalRate: movie.dailyRentalRate
        }
    })

    await newRental.save();

    movie.numberInStock -= 1;
    await movie.save();
    res.send(newRental);
})

module.exports = router;