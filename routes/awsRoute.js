const express = require('express')
const router = express.Router()
const upload = require('../middlewares/aws-upload')
const { uploadFile } = require('../controllers/awsController')

router.route('/upload').post(upload.single('file'), uploadFile)

module.exports = router;