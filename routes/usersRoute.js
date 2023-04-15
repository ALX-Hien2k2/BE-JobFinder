const express = require('express')
const router = express.Router()

const {
    createUser,
    getUserProfile
} = require('../controllers/userController')

router.route('/').post(createUser);
router.route('/:id').get(getUserProfile)
module.exports = router;