const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com', // Default to gmail for ease
        port: process.env.EMAIL_PORT || 587,
        auth: {
            user: process.env.EMAIL_USER, // e.g. your_email@gmail.com
            pass: process.env.EMAIL_PASS  // e.g. Gmail App Password
        }
    });

    const mailOptions = {
        from: 'Weydi Creation <noreply@weydicreation.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
