const express = require('express')
const router = express.Router()

const {
    signUp,
    signIn,
    getAllUserProfiles,
    getUserProfile,
} = require('../controllers/userController')

router.route('/').post(signUp).get(signIn)
router.route('/list').get(getAllUserProfiles)
router.route('/:id').get(getUserProfile)


module.exports = router;