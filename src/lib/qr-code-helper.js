const qrImage = require('qr-image');

class QrCodeHelper {
  static create(details) {
    return qrImage.imageSync(JSON.stringify(details), {type: 'png'});
  }
}

module.exports = QrCodeHelper;