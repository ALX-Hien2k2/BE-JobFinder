const { CV } = require('../models/CVs')
const asyncWrapper = require('../middlewares/async')
const { createCustomError } = require('../errors/custom-error')

const getAllCVs = asyncWrapper(async (req, res, next) => {
    const { postId, userId } = req.query
    const { status, sort } = req.query
    let conditions = {}
    let sortOptions = {}
    if (postId) {
        conditions.postId = postId
    }
    if (userId) {
        conditions.userId = userId
    }
    if (status) {
        conditions.status = status // 1: Chờ phê duyệt 2: Bị từ chối 3: Được đánh dấu là quan tâm 4: Được mời phỏng vấn
    }
    if (sort) {
        sortOptions.createdAt = sort // 1: Tăng đần, -1: Giảm dần theo ngày tạo/ ngày apply
    }
    // console.log("conditions", conditions)
    // console.log("sortOptions", sortOptions)
    let CVs = await CV.find(conditions)
        .sort(sortOptions)
        .populate("userId", "_id");
    res.status(200).json({ CVs })
})

const createCV = asyncWrapper(async (req, res, next) => {
    const newCV = new CV(req.body);
    await newCV.save();
    res.status(201).json(newCV)
})

const getCV = asyncWrapper(async (req, res, next) => {
    const cv_id = req.params.id;
    const cv = await CV.findOne({ _id: cv_id })
    if (!cv) {
        return next(createCustomError(`No CV with id: ${cv_id}`, 404))
    }
    res.status(200).json(cv)
})

const deleteCV = asyncWrapper(async (req, res, next) => {
    const CV_id = req.params.id;
    const cv = await CV.findOneAndDelete({ _id: CV_id })
    if (!cv) {
        return next(createCustomError(`No CV with id: ${CV_id}`, 404))
    }
    res.status(200).json(cv)
})

const updateCV = asyncWrapper(async (req, res, next) => {
    let CV_id = req.params.id;
    const cv = await CV.findOneAndUpdate({ _id: CV_id }, req.body, {
        new: true,
        runValidators: true,
    })
    if (!cv) {
        return next(createCustomError(`No CV with id: ${CV_id}`, 404))
    }
    res.status(200).json(cv)
})

const approveCV = asyncWrapper(async (req, res, next) => {
    let CV_id = req.params.id;
    const statusCode = parseInt(req.body.status);
    const cv = await CV.findOneAndUpdate({ _id: CV_id }, { status: statusCode }, {
        new: true,
        runValidators: true,
    })
    if (!cv) {
        return next(createCustomError(`No CV with id: ${CV_id}`, 404))
    }
    res.status(200).json(cv)
})

module.exports = {
    getAllCVs,
    createCV,
    getCV,
    deleteCV,
    updateCV,
    approveCV,
}