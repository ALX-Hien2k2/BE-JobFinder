const jwt = require('jsonwebtoken');
const asyncWrapper = require('../middlewares/async')
const { createCustomError } = require('../errors/custom-error')

const config = process.env;

const verifyToken = asyncWrapper(async (req, res, next) => {
    const token = req.header('auth-token') || req.body.token;
    // const token = req.header('auth-token') || req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return next(createCustomError("A token is required for authentication", 403))
    }
    const decoded = jwt.verify(token, config.TOKEN_SECRET);
    req.user = decoded;
    console.log("req.user", req.user)
    next()
});

module.exports = verifyToken;