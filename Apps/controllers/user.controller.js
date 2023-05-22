const { User, schema } = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { generateOTP } = require("../utils/otp");
const path = require("path");

//GET USER
exports.get = async (req, res) => {
  const user = await User.find().select("-password");
  res.json(user);
};

//GET A SINGLE USER
exports.getSingleUser = async (req, res) => {
  const id = req.user.userId;
  const user = await User.findById(id).select("-password");
  res.json(user);
};

//CREATE USER AND GENERATE OTP
exports.create = async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).send("User already registered with that email");

  let { name, email, password, role } = req.body;
  // let img;
  // if (req.file) {
  //   img = req.file.path;
  // }

  // console.log("Img => ",img);
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);

  try {
    await generateOTP(email);

    req.session.otpCode = generateOTP.otpCode;
    req.session.userDetails = {
      name,
      email,
      password,
      role,
    };

    res.send("Email sent for OTP verification");
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to send email");
  }
};

//LOGIN
exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(403).send("Email not found");

  let isPassword = await bcrypt.compare(req.body.password, user.password);

  if (isPassword) {
    const token = await jwt.sign(
      { userId: user._id, userRole: user.role },
      process.env.PRIVATE_KEY
    );
    res
      .status(200)
      .json({
        token,
        user: _.pick(user, ["_id", "name", "email", "role", "gender"]),
        msg: "Login Successfully",
      });
  } else {
    return res.status(400).send("INVALID PASSWORD");
  }
};

//FORGET PASSWORD
exports.forgetPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(403).send("Email not found");

  const { email } = req.body;
  const otpCode = await generateOTP(email);

  req.session.otpCode = otpCode;
  req.session.userDetails = { email };
  res.send("Email sent for OTP verification");
};

//VERIFICATION OTP FOR RESET PASSWORD
exports.verification = async (req, res) => {
  const userOtp = req.body.otp;
  const storedOtp = req.session.otpCode;

  if (userOtp === storedOtp) {
    req.session.otpCode = null;
    res.status(200).send({ message: "OTP verification successful" });
  } else {
    res.status(400).send({ error: "Invalid OTP" });
  }
};

//RESET PASSWORD
exports.resetPassword = async (req, res) => {
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const userDetails = req.session.userDetails;

  if (password !== confirmPassword) {
    return res.status(400).send({ error: "Passwords do not match" });
  }

  try {
    // Generate a salt and hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password in the database
    await User.updateOne(
      { email: userDetails.email },
      { password: hashedPassword }
    );

    console.log("Details =>", userDetails);

    req.session.userDetails = null;

    res.status(200).send({ message: "Password updated successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while updating password" });
  }
};

//VERIFY OTP AND  CREATE STORE USER IN DB
exports.verifyOtp = async (req, res) => {
  const userOtp = req.body.otp;

  const storedOtp = req.session.otpCode;
  const userDetails = req.session.userDetails;

  if (userOtp === storedOtp) {
    try {
      const user = await User.create(userDetails);

      req.session.otpCode = null;
      req.session.userDetails = null;

      // res.json(user);
      res
        .status(200)
        .json({
          user: _.pick(user, ["_id", "name", "email", "role"]),
          msg: "Verified Successfully",
        });
    } catch (error) {
      console.error(error);
      res.status(500).send("Failed to create user");
    }
  } else {
    res.status(400).send("Invalid OTP");
  }
};

//UPDATE USER
exports.edit = async (req, res) => {
  const id = req.user.userId;
  const user = await User.findByIdAndUpdate(id, {
    name: req.body.name,
    email: req.body.email,
    gender: req.body.gender,
  });
  res.json(user);
};

//DELETE USER
exports.delete = async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      return res.status(400).send("User Id is required");
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.status(200).json({ user, msg: "Deleted Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the user" });
  }
};

//change Status
exports.changeStatus = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Invalid email");
  }

  if (req.body.is_Active) {
    user.is_Active = true;
    await user.save();
  }

  if (!user.is_Active) {
    return res.status(400).json({ message: "User is not active" });
  }
};

//USER EXPERIENCE
exports.experience = async (req, res) => {
  try {
    const id = req.user.userId;
    const {position, company, startDate, endDate } = req.body;

    const user = await User.findById(id);

    const newExperience = {
      company,
      position,
      startDate,
      endDate,
    };

    user.experience.push(newExperience);
    await user.save();

    res.status(201).json({ message: "User Experience added successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while adding User Experience" });
  }
};

//USER EDUCATION
exports.education = async (req,res) => {
  try {
    const id = req.user.userId;
    const {  degree, startDate, endDate, } = req.body;

    // Find the user by userId
    const user = await User.findById(id);

    // Create a new Education document
    const newEducation = {
      degree,
      startDate,
      endDate,
    };

    // Add the new Education to the user's education array
    user.education.push(newEducation);

    // Save the updated user document
    await user.save();

    res.status(201).json({ message: 'Education added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while adding Education' });
  }
}
