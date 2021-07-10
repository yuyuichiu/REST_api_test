const express = require('express');
const { Genre } = require('../models/genre')
const { Movies, validate } = require('../models/movie')
const router = express.Router();

// GET data
router.get('/', async (req, res) => {
    const movies = await Movies.find().sort('name');
    res.send(movies);
})

router.get('/:id', async (req, res) => {
    const movie = await Movies.findOne({ movie_id: req.params.id })
    if(!movie){ res.status(404).send('Error: The requested movie is not found') }

    res.send(movie);
})

// Upload a new movie
router.post('/', async (req, res) => {
    // validation with Joi
    const { error } = validate(req.body);
    if(error) { return res.status(400).send(error.message) }

    // Find the appropriate genre data
    const genre = await Genre.findOne({ name: req.body.genre })
    if(!genre) { return res.status(400).send('Genre not found') }

    // upload data to mongodb database
    const newMovie = new Movies({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
    });

    await newMovie.save();
    res.send(newMovie);
})


// Update current customer
router.put('/:id', async (req, res) => {
    // validation with Joi
    const { error } = validate(req.body);
    if(error) { return res.status(400).send(error.message) }

    // Find the appropriate genre data
    const genre = await Genre.findOne({ name: req.body.genre })
    if(!genre) { return res.status(400).send('Genre not found') }
    
    // update and upload data to mongodb database
    const movie = await Movies.findOneAndUpdate({ movie_id: req.params.id },{
        $set: {
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        }
    }, { new: true })
    res.send(movie);
})

// Delete customer
router.delete('/:id', async (req, res) => {
    const movie = await Movies.findOneAndDelete({ movie_id: req.params.id });
    if(!movie){ res.status(404).send('Error: The requested movie is not found') }
    res.send(movie)
})

// Export the router object for index.js to use this as middleware
module.exports = router;