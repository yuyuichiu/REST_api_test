const express = require('express');
const router = express.Router();

// GET data
router.get('/', async (req, res) => {
    try {
        // ...
        

    } catch(err) {
        res.status(404).send('Error: ' + err.message)
    }
})

router.get('/:id', async (req, res) => {
    try {
        // ..


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
        // ..


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
        // ..



    } catch(err) {
        res.status(404).send('Error: ' + err.message)
    }
})

// Delete customer
router.delete('/:id', async (req, res) => {
    // ...

    
})

// Export the router object for index.js to use this as middleware
module.exports = router;