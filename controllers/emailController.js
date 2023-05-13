const asyncWrapper = require('../middlewares/async')
const { createCustomError } = require('../errors/custom-error')
const { transporter } = require('../config/email')
const { User } = require('../models/Users')

const config = process.env;

const sendmail = asyncWrapper(async (req, res, next) => {
    const { userId, toEmail, subject, message } = req.body

    let user = await User.findById(userId)
    if (!user) {
        return next(createCustomError("User not found", 409))
    }

    if (user.userType !== 3) {
        return next(createCustomError("Only Employers can use this feature", 409))
    }

    // setup email data
    const mailOptions = {
        from: config.EMAIL_USER,
        to: toEmail,
        subject: subject,
        text: `Company: ${user.companyName} \nAddress: ${user.address} \nPhone: ${user.phone} \nEmail: ${user.email} \n\n${message}`
    };

    // send mail
    let info = await transporter.sendMail(mailOptions);
    if (!info) {
        return next(createCustomError("Send mail failed", 409))
    }

    res.status(200).json({ success: true, message: 'Send mail successfully' })
})


module.exports = {
    sendmail,
}