const { User, schema } = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const { generateOTP } = require('../utils/otp')

//GET USER
exports.get = async (req, res) => {
  const user = await User.find().select('-password')
  res.json(user)
}

//GET A SINGLE USER
exports.getSingleUser = async(req,res) => {
  const id = req.user.userId
  const user = await User.findById(id).select('-password')
  res.json(user);
}

//CREATE USER AND GENERATE OTP
exports.create = async (req, res) => {
  const { error } = schema.validate(req.body)
  if (error) return res.status(404).send(error.details[0].message)

  let user = await User.findOne({ email: req.body.email})
  if (user) return res.status(400).send("User already registered with that email")

  let { name, email, password, role, gender, img } = req.body;
    // let  { img } = req.file ? req.file.filename : null

  console.log("Img => ",img);
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
      gender,
      img
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
  // console.log("req pass =>",req.body.password);
  // console.log("user pass =>", user.password);
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



//UPDATE USER
exports.edit = async (req,res) => {
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
  const user = await User.findByIdAndDelete(id).select('-password')
  res.json({user, msg : "Delete Successfully"})
}



