const express = require('express')
const router = express.Router()

const {
    getUserProfile,
    signUp,
    signIn
} = require('../controllers/userController')

router.route('/').post(signUp).get(signIn)
router.route('/:id').get(getUserProfile)


module.exports = router;