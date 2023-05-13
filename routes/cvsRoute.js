const express = require('express')
const router = express.Router()
const ROLES_LIST = require('../config/allowedRoles')
const verifyRoles = require('../middlewares/verifyRoles')
const multer = require('multer')
const upload = multer({ dest: 'cvs' })
const {
    getAllCVs,
    getAppliedCVs,
    createCV,
    getCV,
    deleteCV,
    updateCV,
    approveCV,
} = require('../controllers/CVsController')

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Employer), getAllCVs)
    // .post(verifyRoles(ROLES_LIST.JobSeeker), createCV)
    .post(verifyRoles(ROLES_LIST.JobSeeker), upload.single('file'), createCV)

router.route('/jobseeker').get(verifyRoles(ROLES_LIST.JobSeeker), getAppliedCVs)

router.route('/:id')
    .get(getCV)
    .patch(verifyRoles(ROLES_LIST.JobSeeker), updateCV)
    .delete(verifyRoles(ROLES_LIST.JobSeeker), deleteCV)
    .put(verifyRoles(ROLES_LIST.Employer), approveCV)

module.exports = router