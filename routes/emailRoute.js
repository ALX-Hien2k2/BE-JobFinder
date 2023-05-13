const express = require('express')
const router = express.Router()
const ROLES_LIST = require('../config/allowedRoles')
const verifyRoles = require('../middlewares/verifyRoles')

const {
    sendmail,
} = require('../controllers/emailController')

router.route('/sendmail').post(sendmail)

module.exports = router;