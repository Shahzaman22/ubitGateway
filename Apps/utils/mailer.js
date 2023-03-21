const nodemailer = require('nodemailer')
const {User } = require('../model/user')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
  });

  async function sendEmail(to, from , subject, text, req, res) {
    // const user = await User.find()
    try {
        const mailOptions = {
            to,
            subject,
            text,
          };
  const info = await transporter.sendMail(mailOptions);
//   console.log(`Email sent: ${info.response}`);

    } 
    catch 
    (error) {
        res.send(error.message)
    }
  

  }

module.exports = {sendEmail}
