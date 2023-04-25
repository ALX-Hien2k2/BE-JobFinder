const express = require('express')
const router = express.Router()
const { PageSort } = require('../middlewares/page-sort')
const ROLES_LIST = require('../config/allowedRoles')
const verifyRole = require('../middlewares/verifyRoles')
const verifyToken = require('../middlewares/verifyToken')
const {
    getAllPosts,
    createPost,
    getPost,
    deletePost,
    updatePost,
    approvePost,
} = require('../controllers/postsController')

router.route('/').get(PageSort, getAllPosts).post(createPost)
router.route('/:id').get(getPost).patch(verifyToken, updatePost).delete(verifyToken, deletePost).put(verifyToken, verifyRole(ROLES_LIST.Admin), approvePost)

module.exports = router