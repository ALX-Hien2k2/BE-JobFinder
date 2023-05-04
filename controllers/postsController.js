const Post = require('../models/Post')
const CV = require('../models/CVs')
const asyncWrapper = require('../middlewares/async')
const { createCustomError } = require('../errors/custom-error')
const ROLES_LIST = require('../config/allowedRoles')
//used by guest or jobseeker
const getAllPosts = asyncWrapper(async (req, res) => {
    const { maxSalary, minSalary } = req.query
    const { address, userId, search } = req.query;
    const conditions = {};
    if (address) {
        conditions.address = { $regex: new RegExp(address, 'i') };
    }
    if (userId) {
        conditions.userId = userId;
    }
    if (search) {
        conditions.title = { $regex: new RegExp(`\\b${req.query.search}\\b`, 'i') };
    }
    conditions.salary = { $gte: minSalary || 0, $lte: maxSalary || 1000000000000000 }
    conditions.status = 3
    conditions.expiredDate = {$gte: new Date(Date.now())}
    let posts = await Post.find(conditions)
        .skip((req.pageNumber - 1) * process.env.PAGE_SIZE) // Bỏ qua số lượng đối tượng cần bỏ qua để đến trang hiện tại
        .limit(process.env.PAGE_SIZE)
        .sort({ [req.column]: req.sortOrder })
        .populate("userId", "_id");
    res.status(200).json(posts)
    // res.status(200).json({ status: "success", data: { nbHits: posts.length, posts } })
})

const createPost = asyncWrapper(async (req, res) => {
    const expiredDate = req.body.expiredDate + " 23:59:59"
    let post = await Post.create({ ...req.body, userId: req.user.id, expiredDate: expiredDate})
    res.status(201).json({ post })
})

const getPost = asyncWrapper(async (req, res, next) => {
    const post_id = req.params.id;
    let post = await Post.findOne({ _id: post_id })
    if (!post) {
        return next(createCustomError(`No post with id: ${post_id}`, 404))
        // return res.status(404).json({ message: `No post with id: ${post_id}` })
    }
    res.status(200).json(post)
})

const deletePost = asyncWrapper(async (req, res, next) => {
    const post_id = req.params.id;
    let post = await Post.findOne({ _id: post_id })
    if (!post) {
        return next(createCustomError(`No post with id: ${post_id}`, 404))
    }
    if (req.user.role === ROLES_LIST.Admin) {
        post = await Post.findOneAndDelete({ _id: post_id })
    }
    else if (req.user.role === ROLES_LIST.Employer) {
        if (post.userId != req.user.id) {
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

    let post = await Post.findOne({ _id: post_id })
    if (!post) {
        return next(createCustomError(`No post with id: ${post_id}`, 404))
    }
    if (post.userId != req.user.id) {
        return next(createCustomError(`Unauthorize`, 401))
    }
    post = await Post.findOneAndUpdate({ _id: post_id }, {...req.body, status: 1}, {
        new: true,
        runValidators: true,
    })
    res.status(200).json({ post })
})

const closePost = asyncWrapper(async (req, res, next) => {
    let post_id = req.params.id;

    let post = await Post.findOne({ _id: post_id })
    if (!post) {
        return next(createCustomError(`No post with id: ${post_id}`, 404))
    }
    if (post.userId != req.user.id) {
        return next(createCustomError(`Unauthorize`, 401))
    }
    post = await Post.findOneAndUpdate({ _id: post_id }, {status: 4}, {
        new: true,
        runValidators: true,
    })
    res.status(200).json({ post })
})

const getHotJobs = asyncWrapper(async (req, res, next) => {
    let posts = await Post.aggregate([
        {
          $lookup: {
            from: "CurriculumVitaes",
            let: { postId: "$_id" },
            pipeline: [
              { $match: { $expr: { $and: [{ $eq: ["$$postId", "$postId"] }] } } },
            ],
            as: "CVs",
          },
        },
        { $match: { status: 3, expiredDate: {$gte: new Date(Date.now())}}},
        {
            $addFields: {
              totalApplicants: { $size: "$CVs" } 
            }
        },
        {
            $project: {
              CVs: 0 
            }
        },
        { $sort: {totalApplicants: -1 }},
        { $limit: 5}
      ]);
    res.status(200).json({ posts })
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
    res.status(200).json(post)
})


module.exports = {
    getAllPosts,
    createPost,
    getPost,
    deletePost,
    updatePost,
    approvePost,
    closePost,
    getHotJobs,
}