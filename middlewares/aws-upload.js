const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../config/aws');

const config = process.env;

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: config.AWS_BUCKET_NAME,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
        },
    }),
});

module.exports = upload;
