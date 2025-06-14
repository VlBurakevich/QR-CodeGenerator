const express = require('express');
const cors = require('cors');

const qrCodeRoutes = require('./api/qrcode.routes');


const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});


app.use('/', qrCodeRoutes);

app.use((req, res) => {
    res.status(404).json({message: 'The requested resource not found'});
});

app.use((err, req, res, _next) => {
    console.error(err.stack || err);
    res.status(500).json({ message: 'Something went wrong on the server!' });
});


module.exports = app;