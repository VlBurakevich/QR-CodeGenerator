const express = require('express');
const cors = require('cors');
const qrcode = require('qrcode');

const app = express();
const PORT = 3001

app.use(cors());
app.use(express.json());

app.post('/generate', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'text is required' });
    }
    try {
        const qrCodeDataUrl = await qrcode.toDataURL(text);

        res.json({ qrCodeDataUrl });
    } catch (err) {
        console.error('Failed to generate QR code', err);
        res.status(500).json({ error: 'Failed to generate QR code' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});