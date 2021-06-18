const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(require('./controllers/authController'));

app.set('port', 4000)
app.get('/', (req, res) => {
    res.json({message: 'server ready'})
})

module.exports = app;