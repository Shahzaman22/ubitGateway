const {User, schema} =  require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const {sendEmail} = require('../utils/mailer')
const {confirmEmail} = require('../utils/confirmationMail')

//GET USER
exports.get = async (req,res) => {
    const user = await User.find()
    res.json(user)
}

//CREATE USER
exports.create = async (req,res) => {
    const {error} = schema.validate(req.body)
    if (error) return res.status(404).send(error.details[0].message)
  
    let user = await User.findOne({ userId: req.body.userId })
    if (user) return res.status(400).send("User already registered")

    user = await new User(req.body)

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password,salt)

    await user.save()
    res.json(user)
}

//LOGIN
exports.login = async (req,res) => {
   const user = await User.findOne({name : req.body.name})
   if(!user) return res.status(403).send("Username not found")

   let isPassword = await bcrypt.compare(req.body.password, user.password)
   if (!isPassword) {
       return res.status(400).send("INVALID PASSWORD")
   }

   const token = await jwt.sign({userId : user._id, userRole : user.role}, process.env.PRIVATE_KEY)
   res.json({token, msg : 'Login successfully'})
   
}

//FORGET PASSWORD
exports.forgetPassword = async (req,res) => {
   const user = await User.findOne({email : req.body.email})
   if(!user) return res.status(403).send('Email not found')

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
      const {token} = req.query; 
      const user = await User.findOneAndUpdate({
        resetPasswordToken: token,
        resetPasswordExpires:  "2023-03-21T12:45:10.200+00:00",
        // resetPasswordExpires: { $gte: Date.now() },
      },
      {password : req.body.password});
      console.log("USERRR => ", user);
      const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password,salt)
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
  