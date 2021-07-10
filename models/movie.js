const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genre');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 200,
        trim: true
    },
    genre: genreSchema,       // reference to the genre collection
    numberInStock: { type: Number, required: true, min: 0, max: 255 },
    dailyRentalRate: { type: Number, required: true, min: 0, max: 255 },
})
movieSchema.plugin(AutoIncrement, {inc_field: 'movie_id'});

const Movies = mongoose.model('Movies', movieSchema, 'movies');

function validateMovie(input) {
    const schema = Joi.object({
        title: Joi.string().min(3).max(200).required(),
        genre: Joi.string().required(),
        numberInStock: Joi.number().min(0).max(255).required(),
        dailyRentalRate: Joi.number().min(0).max(255).required()
    });
  
    return schema.validate(input);
  }
  

exports.Movies = Movies;
exports.validate = validateMovie;