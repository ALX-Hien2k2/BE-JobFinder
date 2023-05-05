const jwt = require('jsonwebtoken');
const asyncWrapper = require('../middlewares/async')
const { createCustomError } = require('../errors/custom-error')
const { User } = require('../models/Users')

const config = process.env;

const verifyToken = asyncWrapper(async (req, res, next) => {
    const token = req.header('auth-token') || req.body.token;
    // const token = req.header('auth-token') || req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return next(createCustomError("A token is required for authentication", 403))
    }
    const decoded = jwt.verify(token, config.TOKEN_SECRET);
    req.user = decoded;
    next()
});

const verify_reset_token = asyncWrapper(async (req, res, next) => {
    const { id, token } = req.body;
    console.log("id: ", id)
    console.log("token: ", token)

    // Check if user exists
    let user = await User.findById(id)
    if (!user) {
        return next(createCustomError("Invalid id...", 409))
    }

    // Check if token is valid
    const secret = config.TOKEN_SECRET + user.password
    const payload = jwt.verify(token, secret);
    if (!payload) {
        return next(createCustomError("Invalid token...", 409))
    }
    res.status(200).json({ message: "Id and Token are valid" })
});

module.exports = {
    verifyToken,
    verify_reset_token,
}