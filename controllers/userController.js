const { User, JobSeeker, Employer, Admin } = require('../models/Users')
const asyncWrapper = require('../middlewares/async')
const { createCustomError } = require('../errors/custom-error')

const getAllUserProfiles = asyncWrapper(async (req, res, next) => {
    let users = await User.find({}).select('-password')
    res.status(200).json(users)
})

const getUserProfile = asyncWrapper(async (req, res, next) => {
    let user_id = req.params.id;
    let user = await User.findOne({ _id: user_id }).select('-password')
    if (!user) {
        return next(createCustomError(`No user with id: ${user_id}`, 404))
    }
    res.status(200).json(user)
})

// Update depending on userType
// Can only update fields that are allowed for that userType
const updateUserProfile = asyncWrapper(async (req, res, next) => {
    let user_id = req.params.id;

    // Can't update some fields
    if (req.body.email || req.body.password || req.body.userType) {
        return next(createCustomError(`Can't update email or password or userType of post using this route`, 400))
    }

    let user = await User.findById(user_id);
    if (!user) {
        return next(createCustomError(`No user with id: ${user_id}`, 404))
    }

    if (user._id != req.user.id) {
        return next(createCustomError(`Can't update other user's profile`, 401))
    }

    let userUpdate
    if (user.userType === 1) { // Update Admin fields
        userUpdate = await Admin.findOneAndUpdate({ _id: user_id }, req.body, {
            new: true,
            runValidators: true,
        });
    } else if (user.userType === 2) { // Update JobSeeker fields
        userUpdate = await JobSeeker.findOneAndUpdate({ _id: user_id }, req.body, {
            new: true,
            runValidators: true,
        });
    } else if (user.userType === 3) { // Update Employer fields
        userUpdate = await Employer.findOneAndUpdate({ _id: user_id }, req.body, {
            new: true,
            runValidators: true,
        });
    }

    const { password, ...other } = userUpdate._doc
    res.status(200).json(other);
})

module.exports = {
    getAllUserProfiles,
    getUserProfile,
    updateUserProfile,
}