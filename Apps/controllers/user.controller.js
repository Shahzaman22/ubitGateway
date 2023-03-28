const { User, schema } = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const _ = require('lodash')
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

  let user = await User.findOne({ email: req.body.email})
  if (user) return res.status(400).send("User already registered with that email")

  let { name, email, password, role, gender } = req.body;


  const salt = await bcrypt.genSalt(10)
  password = await bcrypt.hash(password, salt)


  try {
    await generateOTP(email);

    req.session.otpCode = generateOTP.otpCode;
    req.session.userDetails = {
      name,
      email,
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
  const user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(403).send("Email not found")

  let isPassword = await bcrypt.compare(req.body.password, user.password)
  console.log("req pass =>",req.body.password);
  console.log("user pass =>", user.password);
  if (isPassword) {
    const token = await jwt.sign({ userId: user._id, userRole: user.role }, process.env.PRIVATE_KEY)
  res.status(200).json({token, user: _.pick(user, ['_id', 'name', 'email', 'role', 'gender']), msg : "Login Successfully"})
  }
else {
  return res.status(400).send("INVALID PASSWORD") 

}

}

//FORGET PASSWORD
exports.forgetPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(403).send('Email not found')

  const {email} = req.body;
  const otpCode = await generateOTP(email);

  req.session.otpCode = otpCode;
  req.session.userDetails = {  email  };
  res.send('Email sent for OTP verification');
}


//RESET PASSWORD
exports.resetPassword = async (req, res) => {
  const userOtp = req.body.otp;
  const password = req.body.password;
  const storedOtp = req.session.otpCode;
  const userDetails = req.session.userDetails;

  if (userOtp === storedOtp) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      await User.updateOne({ email: userDetails.email }, { password: hashedPassword });
      
      console.log("Details =>", userDetails);
        
      req.session.otpCode = null;
      req.session.userDetails = null;

      res.status(200).send({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).send({ error: 'An error occurred while updating password' });
    }
  } else {
    res.status(400).send({ error: 'Invalid OTP' });
  }
};


// try {
  //   const { token } = req.query;
  //   const user = await User.findOneAndUpdate({
  //     resetPasswordToken: token,
  //     resetPasswordExpires: { $gte: Date.now() },
  //   },
  //     { password: req.body.password });
  //   const salt = await bcrypt.genSalt(10);
  //   user.password = await bcrypt.hash(req.body.password, salt);

  //   await user.save()

  //   if (!user) {
  //     return res
  //       .status(400)
  //       .json({ message: "Password reset token is invalid or has expired" });
  //   }

  //   user.resetPasswordToken = undefined;
  //   user.resetPasswordExpires = undefined;

  //   const subject = "Your password has been changed";
  //   const text =
  //     `Hi ${user.name},\n\n` +
  //     `This is a confirmation that the password for your account ${user.email} has just been changed.\n`;

  //   await confirmEmail(subject, text);
  //   res.json({ message: "Password reset successfully" });
  // } catch (error) {
  //   console.log(error);
  //   res.json(error.message);
  // }

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
// exports.edit = async (req,res) => {
//   const id = req.user.userId
//  const user = await User.findByIdAndUpdate(id,req.body)
//  if(!user) return res.status(403).send('User not found')

//  let isPassword = await bcrypt.compare(req.body.password, user.password)
//  if (isPassword) {
//    return res.status(400).send("INVALID PASSWORD")
//  }

//  // check if password is updated
//  if (req.body.password) {
//    const salt = await bcrypt.genSalt(10)
//    user.password = await bcrypt.hash(req.body.password, salt)
//    await user.save()
//  }

//  res.json(user)
// }


//UPDATE USER
exports.update = async (req,res) => {
  const id = req.user.userId
  const user = await User.findByIdAndUpdate(id,{
    name : req.body.name,
    email : req.body.email,
    gender : req.body.gender
  })
  res.json(user)
}

//DELETE USER
exports.delete = async(req,res) => {
  const id = req.user.userId
  const user = await User.findByIdAndDelete(id)
  res.json({user, msg : "Delete Successfully"})
}



