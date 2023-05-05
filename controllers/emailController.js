const asyncWrapper = require('../middlewares/async')
const { createCustomError } = require('../errors/custom-error')
const { transporter } = require('../config/email')

const config = process.env;

const sendmail = asyncWrapper(async (req, res, next) => {
    const { toEmail, subject, message } = req.body

    // setup email data
    const mailOptions = {
        from: config.EMAIL_USER,
        to: toEmail,
        subject: subject,
        text: message
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