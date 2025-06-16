const qrcode = require('qrcode');

class QrCodeService {
    async generate({value, size, fgColor, bgColor}) {
        try {
            const options = {
                width: size,
                errorCorrectionLevel: 'H',
                type: 'svg',
                color: {
                    dark: fgColor,
                    light: bgColor
                }
            };

            return await qrcode.toString(value, options);
        } catch(err) {
            console.error('Error during qrCode generation',err);
            throw new Error('Failed to generate QR code');
        }
    }
}

module.exports = new QrCodeService();