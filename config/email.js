const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const config = process.env;

// configure the nodemailer transport
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // this is true as port is 465
    auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS
    }
});

module.exports = {
    transporter,
}