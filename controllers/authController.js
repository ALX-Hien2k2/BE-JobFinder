const { User, Admin, JobSeeker, Employer } = require('../models/Users')
const asyncWrapper = require('../middlewares/async')
const { createCustomError } = require('../errors/custom-error')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { transporter } = require('../config/email')

const config = process.env;

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
    if (userType === 1) {
        newUser = await Admin.create(req.body)
    } else if (userType === 2) {
        newUser = await JobSeeker.create(req.body)
    } else if (userType === 3) {
        newUser = await Employer.create(req.body)
    } else {
        return next(createCustomError("Invalid user type", 409))
    }

    newUser = newUser.toObject()

    // Create token
    const token = jwt.sign(
        { id: newUser._id, email: newUser.email, role: newUser.userType },
        config.TOKEN_SECRET,
        {
            expiresIn: "10m",
        }
    );

    newUser.token = token
    res.status(201).json(newUser)
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
        { id: user._id, email: user.email, role: user.userType },
        config.TOKEN_SECRET,
        {
            expiresIn: "10m",
        }
    );
    user = user.toObject()
    user.token = token

    res.status(201).json(user)
})

const forgotPassword = asyncWrapper(async (req, res, next) => {
    const { email } = req.body;

    // Check if user exists
    let user = await User.findOne({ email: email })
    if (!user) {
        return next(createCustomError("Invalid email", 409))
    }

    // Create one time link valid for 5 minutes
    const secret = config.TOKEN_SECRET + user.password
    const payload = { // User's info
        email: user.email,
        id: user._id,
    }
    const token = jwt.sign(payload, secret, { expiresIn: '300s' })
    const link = `https://jobeevn.netlify.app/resetPassword/${user._id}/${token}` // Change to frontend link
    console.log('link', link)

    // setup email data
    const mailOptions = {
        from: config.EMAIL_USER,
        to: email,
        subject: 'Reset password link (valid for 5 minutes)',
        text: `Click this link to reset your password:\n${link}`
    };

    // send mail
    let info = await transporter.sendMail(mailOptions);
    if (!info) {
        return next(createCustomError("Send mail failed", 409))
    }

    res.status(200).json({ message: 'A link has been sent to your email' })
})

const resetPassword = asyncWrapper(async (req, res, next) => {
    const { id, token, password } = req.body

    // Check if user exists
    let user = await User.findById(id)
    if (!user) {
        return next(createCustomError("Invalid id...", 409))
    }

    // Check if token is valid
    const secret = config.TOKEN_SECRET + user.password
    const payload = jwt.verify(token, secret)
    if (!payload) {
        return next(createCustomError("Invalid token", 409))
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const newPassword = bcrypt.hashSync(password, salt);

    // Update password
    user.password = newPassword
    await user.save()

    res.status(200).json({ user })
})

module.exports = {
    signUp,
    signIn,
    forgotPassword,
    resetPassword,
}