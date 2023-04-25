const Post = require('../models/Post')
const asyncWrapper = require('../middlewares/async')
const { createCustomError } = require('../errors/custom-error')
const ROLES_LIST = require('../config/allowedRoles')
//used by guest or jobseeker
const getAllPosts = asyncWrapper(async (req, res) => {
    const { maxSalary, minSalary } = req.query
    const { location, userId } = req.query;
    const conditions = {};
    if (location) {
        conditions.address = { $regex: new RegExp(location, 'i') };
    }
    if (userId) {
        conditions.userId = userId;
    }
    conditions.salary = { $gte: minSalary || 0, $lte: maxSalary || 1000000000000000 }
    conditions.status = 3
    let posts = await Post.find(conditions)
        .skip((req.pageNumber - 1) * process.env.PAGE_SIZE) // Bỏ qua số lượng đối tượng cần bỏ qua để đến trang hiện tại
        .limit(process.env.PAGE_SIZE)
        .sort({ [req.column]: req.sortOrder })
        .populate("userId", "_id");
    res.status(200).json({ posts })
    // res.status(200).json({ status: "success", data: { nbHits: posts.length, posts } })
})

const createPost = asyncWrapper(async (req, res) => {
    let post = await Post.create({...req.body, userId: req.user.id})
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
    let post = await Post.findOne({_id: post_id})
    if (!post) {
        return next(createCustomError(`No post with id: ${post_id}`, 404))
    }
    if (req.user.role === ROLES_LIST.Admin){
        post = await Post.findOneAndDelete({ _id: post_id })
    }
    else if (req.user.role === ROLES_LIST.Employer){
        if (post.userId != req.user.id){
            return next(createCustomError(`Unauthorize`, 401))
        }
        post = await Post.findOneAndDelete({ _id: post_id })
    }
   
    res.status(200).json({ post })
})

const updatePost = asyncWrapper(async (req, res, next) => {
    let post_id = req.params.id;
    if (req.body.status || req.body.userId) {
        return next(createCustomError(`Can't update status or userId of post using this route`, 400))
    }

    let post = await Post.findOne({_id: post_id})
    if (!post) {
        return next(createCustomError(`No post with id: ${post_id}`, 404))
    }
    if (post.userId != req.user.id){
        return next(createCustomError(`Unauthorize`, 401))
    }
    post = await Post.findOneAndUpdate({ _id: post_id }, req.body, {
        new: true,
        runValidators: true,
    })
    res.status(200).json({ post })
})

const approvePost = asyncWrapper(async (req, res, next) => {
    let post_id = req.params.id;
    const statusCode = parseInt(req.body.status);
    const post = await Post.findOneAndUpdate({ _id: post_id }, { status: statusCode }, {
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
    approvePost,
}