const { User, JobSeeker, Employer, Admin } = require('../models/Users')
const asyncWrapper = require('../middlewares/async')
const { createCustomError } = require('../errors/custom-error')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signUp = asyncWrapper(async (req, res, next) => {
    // Check if user exists
    const { email, userType } = req.body;
    let user = await User.findOne({ email: email })
    if (user) {
        return next(createCustomError("This email has already been used", 409))
    }

    // hash password
    const salt = bcrypt.genSaltSync(10);
    req.body.password = bcrypt.hashSync(req.body.password, salt);

    // Create user
    let newUser;
    if (userType === 2) {
        newUser = await JobSeeker.create(req.body)
    } else if (userType === 3) {
        newUser = await Employer.create(req.body)
    } else {
        newUser = await Admin.create(req.body)
    }

    // Create token
    const token = jwt.sign(
        { id: newUser._id, email: newUser.email },
        process.env.TOKEN_SECRET,
        {
            expiresIn: "30s",
        }
    );

    newUser = newUser._doc
    delete newUser.password
    newUser.token = token

    res.status(201).json({ newUser })
})

const signIn = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email: email })
    if (!user) {
        return next(createCustomError("Invalid email or password", 409))
    }

    // Check if password is correct
    const isPasswordCorrect = bcrypt.compareSync(password, user.password)
    if (!isPasswordCorrect) {
        return next(createCustomError("Invalid email or password", 409))
    }

    // Create token
    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.TOKEN_SECRET,
        {
            expiresIn: "30s",
        }
    );

    user = user._doc
    delete user.password
    user.token = token

    res.status(201).json({ user })
})

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
    signUp,
    signIn,
    getAllUserProfiles,
    getUserProfile,
    updateUserProfile,
}