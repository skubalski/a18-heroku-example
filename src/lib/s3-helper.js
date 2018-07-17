const S3 = require('aws-sdk/clients/s3');
const uuid = require('uuid');

class S3Helper {
  connect() {
    this._s3Instance = new S3({
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || '',
        secretAccessKey: process.env.S3_SECRET || ''
      }
    })
  }

  async upload(content) {
    const name = uuid.v4();
    await this._s3Instance.putObject({
      Bucket: process.env.S3_BUCKET_NAME || '',
      Body: content,
      Key: uuid.v4()
    });
    return name;
  }

  async retrieve(name) {
    const results = await this._s3Instance.getObject({
      Bucket: process.env.S3_BUCKET_NAME || '',
      Key: name
    });
    return results.Body;
  }

}

module.exports = S3Helper;
