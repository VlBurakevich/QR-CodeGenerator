const qrcode = require('qrcode');

class QrcodeService {
    constructor(qrCodeRepository) {
        this.qrCodeRepository = qrCodeRepository;
    }

    async generateSVG({value, size = 256, fgColor = '#000000', bgColor = '#ffffff'}) {
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
        } catch (err) {
            console.error('Error during qrCode generation', err);
            throw new Error('Failed to generate QR code');
        }
    }

    async saveQrCode(data, userId) {
        const {title, value, settings} = data;

        if (!title || !value || !settings || !userId) {
            throw new Error('Title, value, settings, and userId are required.');
        }

        const qrCodeDataToSave = {
            user_id: userId,
            title: title,
            value: value,
            settings: settings
        };

        return this.qrCodeRepository.create(qrCodeDataToSave);
    }

    async getQrCodesForUser(userId) {
        return this.qrCodeRepository.findByUser(userId, {
            orderBy: 'created_at',
            orderDirection: 'DESC'
        });
    }

    async deleteQrCode(qrCodeId, userId) {
        const qrCode = await this.qrCodeRepository.findById(qrCodeId);

        if (!qrCode) {
            return {success: false, status: 404, message: 'QR code not found'};
        }

        if (qrCode.user_id !== userId) {
            return {success: false, status: 403, message: 'Forbidden. You do not own this QR code'};
        }

        await this.qrCodeRepository.destroy(qrCodeId);
        return {success: true, status: 204};
    }
}

module.exports = QrcodeService;