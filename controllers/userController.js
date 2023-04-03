const {JobSeeker, Employer, Admin} = require('../models/Users')
const asyncWrapper = require('../middlewares/async')
const { createCustomError } = require('../errors/custom-error')


const createUser = asyncWrapper(async (req, res, next) => {
    
})

module.exports = {createUser}