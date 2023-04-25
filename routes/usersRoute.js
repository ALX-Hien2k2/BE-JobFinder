const express = require('express')
const router = express.Router()
const ROLES_LIST = require('../config/allowedRoles')
const verifyRole = require('../middlewares/verifyRoles')

const {
    getAllUserProfiles,
    getUserProfile,
    updateUserProfile,
} = require('../controllers/userController')

router.route('/list').get(verifyRole(ROLES_LIST.Admin), getAllUserProfiles) // Only admin can get all users
router.route('/').get(getUserProfile).patch(updateUserProfile)


module.exports = router;