const express = require('express')
const router = express.Router()

const {
    getAllUserProfiles,
    getUserProfile,
    updateUserProfile,
} = require('../controllers/userController')

router.route('/list').get(getAllUserProfiles)
router.route('/:id').get(getUserProfile).patch(updateUserProfile)


module.exports = router;