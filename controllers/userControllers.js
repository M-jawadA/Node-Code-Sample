const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.mailerEmail,
    pass: process.env.mailerPassword,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, dob, gender, phoneNumber, email, password } =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !dob ||
    !gender ||
    !phoneNumber ||
    !email ||
    !password
  ) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({
    $or: [{ email }, { phoneNumber }],
  });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists with specified email or phone number");
  }

  const user = await User.create({
    firstName,
    lastName,
    dob,
    gender,
    phoneNumber,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      firstName: user.fastName,
      lastName: user.lastName,
      dob: user.dob,
      gender: user.gender,
      phoneNumber: user.phoneNumber,
      email: user.email,
      imgUrl: user.imgUrl,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
  const { email, phoneNumber, password } = req.body;

  const user = await User.findOne({ $or: [{ email }, { phoneNumber }] });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      firstName: user.fastName,
      lastName: user.lastName,
      dob: user.dob,
      gender: user.gender,
      phoneNumber: user.phoneNumber,
      email: user.email,
      imgUrl: user.imgUrl,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

//@description     Forget the password
//@route           POST /api/users/forgetPassword
//@access          Public
const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  console.log(
    process.env.mailerEmail,

    process.env.mailerPassword
  );
  const user = await User.findOne({ email });

  if (user) {
    transporter.sendMail({
      to: email,
      from: "abdulraheemtahirkhan@gmail.com",
      subject: "Forget Password!",
      html: `<h3>You requested a forget password!</h3>
      <p>Click this <a href="http://localhost:3000/api/user/forgetPassword?userId=${user._id}">link</a> to forget your password.</p>`,
    });
    res.json(`Email is sent to ${user._id}`);
  } else {
    res.status(401);
    throw new Error("User not found!");
  }
});

module.exports = { registerUser, authUser, forgetPassword };
