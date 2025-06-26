const express = require('express');
const authMiddleware = require('../middleware/authMiddleware.js');
const QrcodeService = require('../service/QrcodeService.js');
const QrcodeRepository = require('../repository/QrcodeRepository.js');
const db = require('../../db/connection.js');

const router = express.Router();

const qrcodeRepository = new QrcodeRepository(db);
const qrcodeService = new QrcodeService(qrcodeRepository);

router.use(authMiddleware);

router.post('/generate', async (req, res, next) => {
    try {
        const {value, size, fgColor, bgColor} = req.body;

        if (!value) {
            return res.status(400).json({error: 'Field "value" is required'});
        }

        const svgString = await qrcodeService.generateSVG({value, size, fgColor, bgColor});

        res.json({qrCodeSvg: svgString});
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const {title, value, size, fgColor, bgColor} = req.body;
        const userId = req.user.id;

        const settings = {size, fgColor, bgColor};

        const savedQrCode = await qrcodeService.saveQrCode({title, value, settings}, userId);

        res.status(201).json(savedQrCode);
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const userId = req.user.id;
        const history = await qrcodeService.getQrCodesForUser(userId);
        res.json(history);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const {id} = req.params;
        const userId = req.user.id;

        const result = await qrcodeService.deleteQrCode(Number(id), userId);

        if (!result.success) {
            return res.status(result.status).json({message: result.message});
        }

        res.status(result.status).send();
    } catch (err) {
        next(err);
    }
});

module.exports = router;