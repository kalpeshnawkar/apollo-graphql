/**
 * @description: requiring nodemailer
 */

const nodemailer = require('nodemailer');

/**
 * @description: Mutation to send an email 
 * @purpose : to send an Email to the given email id 
 */

exports.sendEmailFunction = (url,email) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD

        },
    });
    const mailOptions = {
        from: "FUNDOO HELP",
        to: email,
        subject: 'FUNDOO HELP',
        text: 'Click on the link provided to continue\n\n' + url
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log("Invalid username or password");
            console.log("ERROR: while sending the mail", err)
        }
        else
            console.log('Information regarding the mail sent', info);
    });
}