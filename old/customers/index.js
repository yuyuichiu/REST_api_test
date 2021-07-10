const express = require('express');
const mongoose = require('mongoose');

/* Route */
const customer = require('./branches/customer');

const app = express();
app.use(express.json())
app.use('/api/customers', customer);

const db = 'mongodb://localhost:27017/playground';
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(c => console.log('connected to MongoDB'))
    .catch(err => console.error(err.message))

app.get('/api', function(req, res) {
    res.send('Welcome to customer API!')
})

app.listen(1915, () => { console.log('Listening to port 1915...') })