const { User, Admin, JobSeeker, Employer } = require('../models/Users')
const asyncWrapper = require('../middlewares/async')
const { createCustomError } = require('../errors/custom-error')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = process.env;

const signUp = asyncWrapper(async (req, res, next) => {

})


module.exports = {
    signUp,
}