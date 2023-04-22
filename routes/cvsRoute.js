const express = require('express')
const router = express.Router()
const ROLES_LIST = require('../config/allowedRoles')
const verifyRole = require('../middlewares/verifyRoles')
const {
    getAllCVs,
    createCV,
    getCV,
    deleteCV,
    updateCV,
    approveCV,
} = require('../controllers/CVsController')

router.route('/').get(getAllCVs).post(createCV)
router.route('/:id').get(getCV).patch(updateCV).delete(deleteCV).put(verifyRole(ROLES_LIST.Employer),approveCV)

module.exports = router