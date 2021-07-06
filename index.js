const express = require('express')
const dotenv = require('dotenv')
const fishes = require('./branches/fishes')

dotenv.config();
const app = express();
app.use(express.json());
app.use('/api/fishes', fishes);


app.get('/api', (req, res) => {
    res.send({ title: 'Mock fishes API', message: 'Welcome!' })
})


// Hosting to the port
const port = process.env.PORT || 4000;
app.listen(port, () => { console.log(`Listening to port ${port}...`) })