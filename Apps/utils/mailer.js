const nodemailer = require('nodemailer')

 // Send a reset password email to the user
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
  });

  async function sendEmail(to, subject, text,  res) {
    try {
        const mailOptions = {
            to,
            subject,
            text,
          };
  const info = await transporter.sendMail(mailOptions);

    } 
    catch 
    (error) {
        res.send(error.message)
    }
  

  }

module.exports = {sendEmail}
