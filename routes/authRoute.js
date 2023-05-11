const express = require('express')
const router = express.Router()
const { verify_reset_token } = require('../middlewares/verifyToken')

const {
    signUp,
    signIn,
    forgotPassword,
    resetPassword,
} = require('../controllers/authController')

router.route('/signup').post(signUp)
router.route('/signin').post(signIn)

router.route('/forgotPassword').post(forgotPassword)
router.route('/verifyResetToken').post(verify_reset_token)
router.route('/resetPassword').post(resetPassword)

module.exports = router;