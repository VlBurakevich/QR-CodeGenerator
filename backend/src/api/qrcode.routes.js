const express = require('express');
const QrCodeService = require('../service/qrcode.service');

const router = express.Router();

router.post('/generate', async (req, res, next) => {
    try {
        const {value, size = 256, fgColor = '#000000', bgColor = '#ffffff'} = req.body;

        if (!value) {
            return res.status(400).json({error: 'Field value is required'});
        }

        const options = {value, size, fgColor, bgColor};

        const qrCodeSvg = await QrCodeService.generate(options);

        res.json({qrCodeSvg});
    } catch (err) {
        next(err);
    }
});

module.exports = router;