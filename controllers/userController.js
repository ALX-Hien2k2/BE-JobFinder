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

    newUser = newUser.toObject()

    // Create token
    const token = jwt.sign(
        { id: newUser._id, email: newUser.email },
        process.env.TOKEN_SECRET,
        {
            expiresIn: "30s",
        }
    );

    newUser.token = token
    res.status(201).json({ newUser })
})

// const signIn = asyncWrapper(async (req, res, next) => {
//     const { email, password } = req.body;
//     let user = await User.findOne({ email: email })
//     if (!user) {
//         return next(createCustomError("Invalid email or password", 409))
//     }

//     res.status(201).json({ user })
// })

module.exports = {
    signUp,
    // signIn,
}