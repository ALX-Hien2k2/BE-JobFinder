const express = require('express')
const router = express.Router()

const {
    getAllPosts,
    createPost,
    getPost,
    deletePost,
    updatePost,
} = require('../controllers/postsController')

router.route('/').get(getAllPosts).post(createPost)
router.route('/:id').get(getPost).patch(updatePost).delete(deletePost)

module.exports = router