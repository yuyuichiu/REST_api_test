const express = require('express')
const router = express.Router();
const Joi = require('joi')

const fishes = [
    { id: 1, type: 'Starfish', kg: 0.5 },
    { id: 2, type: 'Goldfish', kg: 0.2 },
    { id: 3, type: 'Salmon', kg: 31.2 }
]

// GET method to retrieve data
router.get('/', (req, res) => {
    res.send(fishes)
})

router.get('/:id', (req, res) =>　{
    // find the data
    const fish = fishes.find(f => f.id === parseInt(req.params.id));
    if (!fish) return res.status(404).send('404: The fish with the specified ID is not found')

    // return the data found
    res.send(fish);
})

// POST method to upload fish to the fish database
router.post('/', (req, res) => {
    // verify data
    const { error } = validateFish(req.body);
    if (error) return res.status(400).send('400: ' + error.message);

    // add new data to the fish array
    const newFish = { id: fishes.length+1 , type: req.body.type, kg: parseFloat(req.body.kg)}
    fishes.push(newFish)
    res.send(newFish);
})

// PUT method to update current fishes
router.put('/:id', (req, res) => {
    // Find if data exist
    let fish = fishes.find(f => f.id === parseInt(req.params.id));
    if (!fish) return res.status(404).send('404: The targeted fish is not found');

    // Validate the input
    const { error } = validateFish(req.body)
    if (error) return res.status(400).send('400: ' + error.message);

    // Update the data
    const index = fishes.indexOf(fish);
    fish = { id: parseInt(req.params.id), type: req.body.type, kg: req.body.kg }
    fishes[index] = fish;
    res.send(fish);
})

// Delete method to delete fishes from current fishes
router.delete('/:id', (req, res) => {
    // Find the fish to delete
    let fish = fishes.find(f => f.id === parseInt(req.params.id));
    if (!fish) return res.status(404).send('404: The targeted fish is not found');

    // Delete the fish
    const index = fishes.indexOf(fish);
    fishes.splice(index, 1);
    res.send(fish);
});

// Data validation function
function validateFish(input) {
    const schema = Joi.object({
        type: Joi.string().min(3).required(),
        kg: Joi.number().positive().required()
    })

    return schema.validate(input);
}

// Export out the router object
module.exports = router;