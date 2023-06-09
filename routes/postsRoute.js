const express = require('express')
const router = express.Router()
const { PageSort } = require('../middlewares/page-sort')
const ROLES_LIST = require('../config/allowedRoles')
const verifyRoles = require('../middlewares/verifyRoles')
const { verifyToken } = require('../middlewares/verifyToken')
const {
    getAllPosts,
    createPost,
    getPost,
    deletePost,
    updatePost,
    approvePost,
    closePost,
    getHotJobs,
    getAllPostsByAdmin,
    getAllPostsByEmployer,
    openPost
} = require('../controllers/postsController')

router.route('/').get(PageSort, getAllPosts).post(verifyToken, verifyRoles(ROLES_LIST.Employer), createPost)
router.route('/hot-jobs').get(getHotJobs)
router.route('/admin').get(verifyToken, verifyRoles(ROLES_LIST.Admin),PageSort, getAllPostsByAdmin)
router.route('/employer').get(verifyToken, verifyRoles(ROLES_LIST.Employer),PageSort, getAllPostsByEmployer)
router.route('/:id').get(getPost).patch(verifyToken, verifyRoles(ROLES_LIST.Employer), updatePost).delete(verifyToken, verifyRoles(ROLES_LIST.Employer, ROLES_LIST.Admin), deletePost).put(verifyToken, verifyRoles(ROLES_LIST.Admin), approvePost)
router.route('/close/:id').put(verifyToken, verifyRoles(ROLES_LIST.Employer), closePost)
router.route('/open/:id').put(verifyToken, verifyRoles(ROLES_LIST.Employer), openPost)


module.exports = router