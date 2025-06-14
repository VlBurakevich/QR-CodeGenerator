const express = require('express');
const qrCodeService = require('../service/qrcode.service');

const router = express.Router();

router.post('/generate', async (req, res, next) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({error: 'text is required'});
        }

        const qrCodeDataUrl = await qrCodeService.generate(text);

        res.json({qrCodeDataUrl});
    } catch (err) {
        next(err);
    }
});

module.exports = router;