const { User } = require('../models/Users')
const asyncWrapper = require('../middlewares/async')
const { createCustomError } = require('../errors/custom-error')

const getUserProfile = asyncWrapper(async (req, res, next) => {
    const userId = req.params.id;
    let user = await User.findOne({ _id: userId })
    if (!user) {
        return next(createCustomError(`No user with id: ${userId}`, 404))
    }
    const { password, userType, __t, ...other } = user._doc
    res.status(200).json({ user: other })
})

module.exports = { getUserProfile }