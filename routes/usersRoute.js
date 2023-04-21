const express = require('express')
const router = express.Router()

const {
    signUp,
    signIn
} = require('../controllers/userController')

router.route('/').post(signUp).get(signIn)


module.exports = router;