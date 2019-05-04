var aws = require('aws-sdk')
var multer = require('multer')
var upload = multer();
var multerS3 = require('multer-s3')
var s3 = new aws.S3({
    region: 'ap-south-1',
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey
})
var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'myfundoo',
        metadata: function (req, file, callback) {
            callback(null, { fieldName: file.fieldname });
        },
        key: function (req, file, callback) {
            callback(null, Date.now().toString()) 
        }
    })
})

module.exports = upload