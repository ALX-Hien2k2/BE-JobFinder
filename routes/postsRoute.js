const express = require('express')
const router = express.Router()
const {PageSort} = require('../middlewares/page-sort')
const {
    getAllPosts,
    createPost,
    getPost,
    deletePost,
    updatePost,
    approvePost,
} = require('../controllers/postsController')

router.route('/').get(PageSort,getAllPosts).post(createPost)
router.route('/:id').get(getPost).patch(updatePost).delete(deletePost).put(approvePost)

module.exports = router