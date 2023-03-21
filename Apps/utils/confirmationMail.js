const nodemailer = require('nodemailer')
const {User } = require('../model/user')

 // Send a confirmation email to the user
 const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
  });
  async function confirmEmail(to, from , subject, text, req, res) {
    const user = await User.find()
  const mailOptions = {
    to : "shahzaman.aftab@gmail.com",
    subject: 'Your password has been changed',
    text: `Hi ${user.name},\n\n`
      + `This is a confirmation that the password for your account ${user.email} has just been changed.\n`
  };

  await transporter.sendMail(mailOptions);


  }

module.exports = {confirmEmail};