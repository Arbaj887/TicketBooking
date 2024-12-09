const QR = require('qrcode');

const generateQR = async (value) => {
    try {
        
        const val = JSON.stringify({
            source: value?.source,
            destination: value?.destination,
            price: value?.price,
            routes: value?.routes,
            expiredAt :new Date(value?.expAt).toLocaleTimeString(),
            createdAt:new Date( value?.createdAt).toLocaleDateString(),
        });

        
        const qr = await QR.toDataURL(val);
        return qr;
    } catch (err) {
        console.log(err);
        throw new Error('QR code generation failed');
        
    }
};

module.exports = generateQR;