const postsRoute = require('./postsRoute')
const usersRoute = require('./usersRoute')
const cvsRoute = require('./cvsRoute')
const authRoute = require('./authRoute')
const emailRoute = require('./emailRoute')
const { verifyToken } = require('../middlewares/verifyToken')
const notFound = require('../middlewares/not-found')
const errorHandlerMiddleware = require('../middlewares/error-handler')

const route = (app) => {
    app.use('/api/v1/auth', authRoute);
    app.use('/api/v1/posts', postsRoute);
    app.use('/api/v1/users', verifyToken, usersRoute);
    app.use('/api/v1/cvs', verifyToken, cvsRoute);
    app.use('/api/v1/email', emailRoute);
    app.use(notFound);
    app.use(errorHandlerMiddleware);
};

module.exports = route