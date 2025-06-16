const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const qrCodeRoutes = require('./api/qrcode.routes');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/qrCode', qrCodeRoutes);

app.use((err, req, res) => {
    console.error(err.stack || err);

    res.status(500).json({
        message: 'Something went wrong on the server'
    });
});

module.exports = app;