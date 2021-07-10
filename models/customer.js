const mongoose = require('mongoose');
const Joi = require('joi');
const AutoIncrement = require('mongoose-sequence')(mongoose);

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
        maxlength: 12
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

exports.Customers = Customers;
exports.validate = validateCustomer;
exports.validateStrict = validateCustomerStrict;