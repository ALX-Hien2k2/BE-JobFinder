const express = require('express')
const router = express.Router()

const {
    signUp,
    signIn,
    getAllUserProfiles,
    getUserProfile,
    updateUserProfile,
} = require('../controllers/userController')

router.route('/').post(signUp).get(signIn)
router.route('/list').get(getAllUserProfiles)
router.route('/:id').get(getUserProfile).patch(updateUserProfile)


module.exports = router;