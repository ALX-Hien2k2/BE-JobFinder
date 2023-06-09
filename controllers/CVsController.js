const { CV } = require('../models/CVs')
const { User, Employer } = require('../models/Users')
const Post = require('../models/Post')
const asyncWrapper = require('../middlewares/async')
const { createCustomError } = require('../errors/custom-error')
const ROLES_LIST = require('../config/allowedRoles')
const { uploadToS3 } = require('../middlewares/aws-upload')

// For Admin and Employer
const getAllCVs = asyncWrapper(async (req, res, next) => {
    console.log("req.query", req.query)
    let conditions = {}
    let { userId, postId, status, sortOption } = req.query
    if (req.user.role === ROLES_LIST.Employer && !postId) {
        return next(createCustomError(`postId is required`, 400))
    }
    if (userId) {
        conditions.userId = userId
    }
    if (postId) {
        conditions.postId = postId
    }
    if (status) {
        conditions.status = status // 1: Chờ phê duyệt 2: Bị từ chối 3: Được đánh dấu là quan tâm 4: Được mời phỏng vấn
    }
    let CVs = await CV.find(conditions)
        .sort({ createdAt: sortOption || "asc" })
        .populate("userId", ["name", "avatar", "email", "phone", "address"])
        .populate({
            path: 'postId',
            model: Post,
            select: 'title',
            populate: {
                path: 'userId',
                model: User,
                select: 'companyName',
            },
        })
    res.status(200).json(CVs)
})

// For JobSeeker
const getAppliedCVs = asyncWrapper(async (req, res, next) => {
    console.log("req.query", req.query)
    let conditions = {}
    let { userId, status, sortOption } = req.query
    if (!userId) {
        return next(createCustomError(`userId is required`, 400))
    }
    if (req.user.id != userId) {
        return next(createCustomError(`Unauthorize`, 401))
    }
    conditions.userId = userId
    if (status) {
        conditions.status = status // 1: Chờ phê duyệt 2: Bị từ chối 3: Được đánh dấu là quan tâm 4: Được mời phỏng vấn
    }
    let CVs = await CV.find(conditions)
        .sort({ createdAt: sortOption || "asc" })
        .populate("userId", ["name", "avatar", "email", "phone", "address"])
        .populate({
            path: 'postId',
            model: Post,
            select: 'title',
            populate: {
                path: 'userId',
                model: User,
                select: 'companyName',
            },
        })
    res.status(200).json(CVs)
})

const createCV = asyncWrapper(async (req, res, next) => {
    let { postId, description } = req.body
    let { file } = req

    // Validate the data
    if (!postId) {
        return next(createCustomError(`postId is required`, 400))
    }
    if (!description) {
        return next(createCustomError(`description is required`, 400))
    }
    if (!file) {
        return next(createCustomError(`File is required`, 400))
    }

    // Check if post exists
    let post = await Post.findById(postId)
    if (!post) {
        return next(createCustomError(`No post with id: ${postId}`, 404))
    }

    // Upload file to S3
    let cvUrl = await uploadToS3(file);

    // Create new CV object
    let newCv_Obj = {
        userId: req.user.id,
        postId: postId,
        description: description,
        CVFileURL: cvUrl
    }

    let cv = await CV.create(newCv_Obj)
    res.status(201).json(cv)
})

const getCV = asyncWrapper(async (req, res, next) => {
    let cv_id = req.params.id;
    let cv = await CV.findOne({ _id: cv_id })
        .populate("userId", ["name", "avatar", "email", "phone", "address"])
        .populate({
            path: 'postId',
            model: Post,
            select: 'title',
            populate: {
                path: 'userId',
                model: User,
                select: 'companyName',
            },
        })
    // Note: Vì cv đã được populate nên userId là object chứa các field khác của user, bao gồm cả id
    if (!cv) {
        return next(createCustomError(`No CV with id: ${cv_id}`, 404))
    }
    if (req.user.role === ROLES_LIST.JobSeeker) {
        if (cv.userId.id != req.user.id) {
            return next(createCustomError(`Unauthorize`, 401))
        }
    } else if (req.user.role === ROLES_LIST.Employer) {
        let post = await Post.findById(cv.postId)
        if (!post) {
            return next(createCustomError(`No post with id: ${cv.postId}`, 404))
        }
        if (post.userId != req.user.id) {
            return next(createCustomError(`Unauthorize`, 401))
        }
    }
    res.status(200).json(cv)
})

const deleteCV = asyncWrapper(async (req, res, next) => {
    let cv_id = req.params.id;
    let cv = await CV.findOne({ _id: cv_id })
    if (!cv) {
        return next(createCustomError(`No CV with id: ${cv_id}`, 404))
    }
    if (cv.userId != req.user.id) {
        return next(createCustomError(`Unauthorize`, 401))
    }
    cv = await CV.findOneAndDelete({ _id: cv_id })
    res.status(200).json(cv)
})

const updateCV = asyncWrapper(async (req, res, next) => {
    let cv_id = req.params.id;
    if (req.body.userId || req.body.postId || req.body.status) {
        return next(createCustomError(`Can't update userId or postId or status of cv using this route`, 400))
    }
    let cv = await CV.findOne({ _id: cv_id })
    if (!cv) {
        return next(createCustomError(`No CV with id: ${cv_id}`, 404))
    }
    if (cv.userId != req.user.id) {
        return next(createCustomError(`Unauthorize`, 401))
    }
    cv = await cv.findOneAndUpdate({ _id: cv_id }, req.body, {
        new: true,
        runValidators: true,
    })
    res.status(200).json(cv)
})

const approveCV = asyncWrapper(async (req, res, next) => {
    let cv_id = req.params.id;
    let statusCode = req.body.status;
    if (typeof statusCode !== "number" || ![1, 2, 3, 4].includes(statusCode)) {
        return next(createCustomError(`Invalid value! Status code must be a number between 1 and 4`, 400))
    }
    let cv = await CV.findOneAndUpdate({ _id: cv_id }, { status: statusCode }, {
        new: true,
        runValidators: true,
    })
        .populate("userId", ["name", "avatar", "email", "phone", "address"]);
    if (!cv) {
        return next(createCustomError(`No CV with id: ${cv_id}`, 404))
    }
    res.status(200).json(cv)
})

module.exports = {
    getAllCVs,
    getAppliedCVs,
    createCV,
    getCV,
    deleteCV,
    updateCV,
    approveCV,
}