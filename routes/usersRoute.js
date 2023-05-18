const express = require('express')
const router = express.Router()
const ROLES_LIST = require('../config/allowedRoles')
const verifyRole = require('../middlewares/verifyRoles')
const { verifyToken } = require('../middlewares/verifyToken')

const {
    getAllUserProfiles,
    getUserProfile,
    updateUserProfile,
} = require('../controllers/userController')

router.route('/list').get(verifyToken, verifyRole(ROLES_LIST.Admin), getAllUserProfiles) // Only admin can get all users
router.route('/:id').get(getUserProfile).patch(verifyToken,updateUserProfile)

module.exports = router;