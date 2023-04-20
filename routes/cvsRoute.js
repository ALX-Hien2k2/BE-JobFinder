const express = require('express')
const router = express.Router()

const {
    getAllCVs,
    createCV,
    getCV,
    deleteCV,
    updateCV,
    approveCV,
} = require('../controllers/CVsController')

router.route('/').get(getAllCVs).post(createCV)
router.route('/:id').get(getCV).patch(updateCV).delete(deleteCV).put(approveCV)

module.exports = router