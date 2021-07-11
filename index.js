const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const customers = require('./branches/customers')
const genres = require('./branches/genres')
const movies = require('./branches/movies')
const rentals = require('./branches/rentals')
const logins = require('./branches/logins')
const users = require('./branches/users')

dotenv.config();
const app = express();
app.use(express.json());
app.use('/movies/api/customers', customers);
app.use('/movies/api/genres', genres);
app.use('/movies/api/rentals', rentals);
app.use('/movies/api', movies);
app.use('/movies/api/users', users);
app.use('/movies/api/logins', logins);

const db = "mongodb://localhost:27017/movies"
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(c => console.log('Connected to MongoDB.'))
    .catch(err => console.error(err));

app.get('/', (req, res) => {
    res.send({ title: 'Welcome', message: 'Go to path /movies/api to try the movie API' })
})

app.get('/movies/api', (req, res) => {
    res.send({
        title: 'Movies API',
        paths: ['customers','genre'],
        message: 'Welcome! Please use postman to test http requests other than GET.'
    })
})


// Hosting to the port
const port = process.env.PORT || 4000;
app.listen(port, () => { console.log(`Listening to port ${port}...`) })