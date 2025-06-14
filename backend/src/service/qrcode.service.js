const qrcode = require('qrcode');

const qrCodeService = {
    async generate(text) {
        try {
            return await qrcode.toDataURL(text);
        } catch (err) {
            console.error('Underlying QR-code generation failed', err);
            throw new Error('Failed to generate QR-code');
        }
    }
}

module.exports = qrCodeService;