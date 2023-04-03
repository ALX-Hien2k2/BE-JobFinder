const express = require('express')
const router = express.Router()

const {
    getAllCVs,
    createCV,
    getCV,
    deleteCV,
    updateCV,
} = require('../controllers/CVsController')

router.route('/').get(getAllCVs).post(createCV)
router.route('/:id').get(getCV).patch(updateCV).delete(deleteCV)

module.exports = router