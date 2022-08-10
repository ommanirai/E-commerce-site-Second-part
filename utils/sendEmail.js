const nodemailer = require("nodemailer");

const sendEmail = async ( mailOptions ) => {

    var transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });


    const message = {
        from: mailOptions.from, // sender address
        to: mailOptions.to, // list of receivers
        subject: mailOptions.subject, // Subject line
        text: mailOptions.text, // plain text body
        html: mailOptions.html // html body

    }
    await transport.sendMail(message)

};

module.exports = sendEmail