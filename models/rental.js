const Joi = require('joi');
const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: { type: String, required: true, minlength: 3, maxlength: 255 },
            phone: { type: Number, required: true },
            isGold: { type: Boolean, required: true },
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 200,
                trim: true
            },
            numberInStock: { type: Number, required: true, min: 0, max: 255 },
            dailyRentalRate: { type: Number, required: true, min: 0, max: 255 },
        }),
        required: true
    },
    dateOut: { type: Date, required: true, default: Date.now },
    dateReturned: { type: Date },
    rentalFee: { type: Number, min: 0 },
})

const Rentals = mongoose.model('Rentals', rentalSchema, 'rentals')

function validateRental(input) {
    const schema = Joi.object({
        customerId: Joi.string().required(),
        movieId: Joi.string().required()
    });

    return schema.validate(input)
}

module.exports.Rentals = Rentals;
module.exports.validate = validateRental;