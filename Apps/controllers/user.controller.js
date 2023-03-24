const { User, schema } = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { sendEmail } = require('../utils/mailer')
const { confirmEmail } = require('../utils/confirmationMail')
const { generateOTP } = require('../utils/otp')

//GET USER
exports.get = async (req, res) => {
  const user = await User.find()
  res.json(user)
}

//CREATE USER AND GENERATE OTP
exports.create = async (req, res) => {
  const { error } = schema.validate(req.body)
  if (error) return res.status(404).send(error.details[0].message)

  let user = await User.findOne({ userId: req.body.userId })
  if (user) return res.status(400).send("User already registered")

  let { name, email, userId, password, role, gender } = req.body;


  const salt = await bcrypt.genSalt(10)
  password = await bcrypt.hash(password, salt)


  try {
    await generateOTP(email);

    req.session.otpCode = generateOTP.otpCode;
    req.session.userDetails = {
      name,
      email,
      userId,
      password,
      role,
      gender
    };

    res.send('Email sent for OTP verification');
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to send email');
  }

}

//LOGIN
exports.login = async (req, res) => {
  const user = await User.findOne({ name: req.body.name })
  if (!user) return res.status(403).send("Username not found")

  let isPassword = await bcrypt.compare(req.body.password, user.password)
  if (!isPassword) {
    return res.status(400).send("INVALID PASSWORD")

  }

  const token = await jwt.sign({ userId: user._id, userRole: user.role }, process.env.PRIVATE_KEY)
  res.json({ token, msg: 'Login successfully' })

}

//FORGET PASSWORD
exports.forgetPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(403).send('Email not found')

  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save()
  console.log("FORGET TOKEN =>", user.resetPasswordToken);
  console.log("Date =>", user.resetPasswordExpires);
  const { email } = req.body;

  const subject = 'Password reset request'
  const text = `Hi ${user.name},\n\n`
    + `You are receiving this email because you (or someone else) has requested a password reset for your account.\n\n`
    + `Please click on the following link, or paste it into your browser to complete the process:\n\n`
    + `${req.headers.host}/reset-password/${user.resetPasswordToken}\n\n`
    + `If you did not request this, please ignore this email and your password will remain unchanged.\n`

  await sendEmail(email, subject, text);
  res.json({ message: 'Password reset email sent' });
}

//RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOneAndUpdate({
      resetPasswordToken: token,
      resetPasswordExpires: { $gte: Date.now() },
    },
      { password: req.body.password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    await user.save()

    if (!user) {
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expired" });
    }

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    const subject = "Your password has been changed";
    const text =
      `Hi ${user.name},\n\n` +
      `This is a confirmation that the password for your account ${user.email} has just been changed.\n`;

    await confirmEmail(subject, text);
    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    res.json(error.message);
  }
};

//VERIFY OTP AND STORE USER IN DB 
exports.verifyOtp = async (req, res) => {
  const userOtp = req.body.otp;

  const storedOtp = req.session.otpCode;
  const userDetails = req.session.userDetails;

  if (userOtp === storedOtp) {
    try {
      const user = await User.create(userDetails);

      req.session.otpCode = null;
      req.session.userDetails = null;

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).send('Failed to create user');
    }
  } else {
    res.status(400).send('Invalid OTP');
  }
};


//EDIT USER PASSWORD
exports.edit = async (req,res) => {
  const id = req.user.userId
 const user = await User.findByIdAndUpdate(id,req.body)
 if(!user) return res.status(403).send('User not found')

 let isPassword = await bcrypt.compare(req.body.password, user.password)
 if (isPassword) {
   return res.status(400).send("INVALID PASSWORD")
 }

 // check if password is updated
 if (req.body.password) {
   const salt = await bcrypt.genSalt(10)
   user.password = await bcrypt.hash(req.body.password, salt)
   await user.save()
 }

 res.json(user)
}

//DELETE USER
exports.delete = async(req,res) => {
  const id = req.user.userId
  const user = await User.findByIdAndDelete(id)
  res.json({user, msg : "Delete Successfully"})
}

