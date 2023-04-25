const express = require('express')
const router = express.Router()
const { PageSort } = require('../middlewares/page-sort')
const ROLES_LIST = require('../config/allowedRoles')
const verifyRoles = require('../middlewares/verifyRoles')
const verifyToken = require('../middlewares/verifyToken')
const {
    getAllPosts,
    createPost,
    getPost,
    deletePost,
    updatePost,
    approvePost,
} = require('../controllers/postsController')

router.route('/').get(PageSort, getAllPosts).post(verifyToken, verifyRoles(ROLES_LIST.Employer),createPost)
router.route('/:id').get(getPost).patch(verifyToken,verifyRoles(ROLES_LIST.Employer), updatePost).delete(verifyToken, verifyRoles(ROLES_LIST.Employer, ROLES_LIST.Admin),deletePost).put(verifyToken, verifyRoles(ROLES_LIST.Admin), approvePost)

module.exports = router