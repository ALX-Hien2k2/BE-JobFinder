const Post = require('../models/Post')
const asyncWrapper = require('../middlewares/async')
const { createCustomError } = require('../errors/custom-error')

const getAllPosts = asyncWrapper(async (req, res) => {
    let posts = await Post.find({})
    res.status(200).json({ posts })
    // res.status(200).json({ status: "success", data: { nbHits: posts.length, posts } })
})

const createPost = asyncWrapper(async (req, res) => {
    let post = await Post.create(req.body)
    res.status(201).json({ post })
})

const getPost = asyncWrapper(async (req, res, next) => {
    const post_id = req.params.id;
    let post = await Post.findOne({ _id: post_id })
    if (!post) {
        return next(createCustomError(`No post with id: ${post_id}`, 404))
        // return res.status(404).json({ message: `No post with id: ${post_id}` })
    }
    res.status(200).json({ post })
})

const deletePost = asyncWrapper(async (req, res, next) => {
    const post_id = req.params.id;
    let post = await Post.findOneAndDelete({ _id: post_id })
    if (!post) {
        return next(createCustomError(`No post with id: ${post_id}`, 404))
    }
    res.status(200).json({ post })
})

const updatePost = asyncWrapper(async (req, res, next) => {
    let post_id = req.params.id;
    const post = await Post.findOneAndUpdate({ _id: post_id }, req.body, {
        new: true,
        runValidators: true,
    })
    if (!post) {
        return next(createCustomError(`No post with id: ${post_id}`, 404))
    }
    res.status(200).json({ post })
})

module.exports = {
    getAllPosts,
    createPost,
    getPost,
    deletePost,
    updatePost,
}