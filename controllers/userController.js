const { User, JobSeeker, Employer, Admin } = require('../models/Users')
const asyncWrapper = require('../middlewares/async')
const { createCustomError } = require('../errors/custom-error')

const getAllUserProfiles = asyncWrapper(async (req, res, next) => {
    const users = await User.find({}).select('-password')
    console.log("users", users)
    res.status(200).json({ users })
})

const getUserProfile = asyncWrapper(async (req, res, next) => {
    const user_id = req.params.id;
    let user = await User.findOne({ _id: user_id })
    if (!user) {
        return next(createCustomError(`No user with id: ${user_id}`, 404))
    }
    const { password, ...other } = user._doc
    res.status(200).json({ user: other })
})

// Update depending on userType
// Can only update fields that are allowed for that userType
const updateUserProfile = asyncWrapper(async (req, res, next) => {
    const user_id = req.params.id;
    console.log("user_id", user_id)
    console.log("req.body", req.body)

    // Check if password is being updated
    if (req.body.password) {
        return next(createCustomError(`Cannot update password using this route`, 400))
    }

    const user = await User.findById(user_id);
    console.log("user", user)
    if (!user) {
        return next(createCustomError(`No user with id: ${user_id}`, 404))
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
    console.log("userUpdate", userUpdate)
    const { password, ...other } = userUpdate._doc
    res.status(200).json(other);
})

module.exports = {
    getAllUserProfiles,
    getUserProfile,
    updateUserProfile,
}