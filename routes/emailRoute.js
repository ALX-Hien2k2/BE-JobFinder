const express = require('express')
const router = express.Router()

const {
    sendmail,
} = require('../controllers/emailController')

router.route('/sendmail').post(sendmail)

module.exports = router;