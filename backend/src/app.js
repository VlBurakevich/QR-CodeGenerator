require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.route.js');
const qrcodeRoutes = require('./routes/qrcode.route.js');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth/', authRoutes);
app.use('/api/qrCode/', qrcodeRoutes);

app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500).send('Error');
});

module.exports = app;