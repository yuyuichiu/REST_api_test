const express = require('express');
const Joi = require('joi');
const router = express.Router();
const mongoose = require('mongoose');

const fishSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        lowercase: true,
        trim: true
    },
    kg: { 
        type: Number,
        required: true,
        get: function(v) { return Math.round(v * 100) / 100 },
        set: function(v) { return Math.round(v * 100) / 100 }
    },
    date: { type: Date, default: new Date() },
    tags: {
        type: Array,
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: 'Please provide at least one tag for the fish'
        }
    }
})

const Fishes = mongoose.model('Fishes', fishSchema, 'fishes');


// GET method to retrieve data
router.get('/', async (req, res) => {
    res.send(await Fishes.find().sort('type'));
})

router.get('/:id', async (req, res) =>　{
    // Find the data
    const fish = await Fishes.find({ _id: req.params.id }).sort('type');
    if (!fish) return res.status(404).send('404: The fish with the specified ID is not found')

    // Return the data found
    res.send(fish);
})

// POST method to upload fish to the fish database
router.post('/', async (req, res) => {
    // Verify data
    const { error } = validateFish(req.body);
    if (error) return res.status(400).send('400: ' + error.message);
    
    // Add new data to the fish array
    try{
        const newFish = new Fishes({
            type: req.body.type,
            kg: req.body.kg,
            tags: req.body.tags
        });

        res.send(await newFish.save());
    } catch(err) {
        console.log("Error: ", err.message);
        res.status(400).send('400: ' + error.message)
    }
})

// PUT method to update current fishes (query first approach)
router.put('/:id', async (req, res) => {
    // Find to see if data exist
    let fish = await Fishes.findOne({ _id: req.params.id });
    if (!fish) return res.status(404).send('404: The targeted fish is not found');

    // Validate the input
    const { error } = validateFishUpdate(req.body);
    if (error) return res.status(400).send('400: ' + error.message);

    // Update the save changes to server
    try{
        if(req.body.type) { fish.type = req.body.type }
        if(req.body.kg) { fish.kg = req.body.kg }
        if(req.body.tags) { fish.tags = req.body.tags }

        fish.save();
    } catch(err) {
        console.log("Error: ", err.message);
        res.status(400).send('400: ' + error.message)
    }

    res.send(fish);
})

// Delete method to delete fishes from current fishes
router.delete('/:id', async (req, res) => {
    // Find the fish to delete
    const id = mongoose.Types.ObjectId(req.params.id);
    const fish = await Fishes.findByIdAndRemove(id);
    if (!fish) return res.status(404).send('404: The targeted fish is not found');

    res.send(fish);
});

// Data validation function
function validateFish(input) {
    const schema = Joi.object({
        type: Joi.string().min(4).max(255).required(),
        kg: Joi.number().positive().required(),
        tags: Joi.array().min(1).required()
    })

    return schema.validate(input);
}

function validateFishUpdate(input){
    const schema = Joi.object({
        type: Joi.string().min(4).max(255),
        kg: Joi.number().positive(),
        tags: Joi.array().min(1)
    })

    return schema.validate(input);
}

// Function to manually add fish without post command (inactive)
async function addFish() {
    const fish = new Fishes({
        type: 'silverfish',
        kg: 0.3,
        tags: ['silverfish','not fish']
    })
    
    try{
        const result = await fish.save();
        console.log(result);
    } catch(err) {
        console.log("Error - ", err.message)
    }
}

// Export out the router object
module.exports = router;