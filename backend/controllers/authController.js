const User = require("../models/User");
const { signupInput } = require("../utils/verify");
const { signinInput } = require("../utils/verify");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { ACCESS_TOKEN_SECRET } = process.env;

// Signup Handler
const signup = async (req, res) => {
  const result = signupInput.safeParse(req.body);

  try {
    if (!result.success) {
      return res.status(400).json({
        status: false,
        msg: "Invalid input",
        errors: result.error.errors,
      });
    }

    const { email, password, name } = result.data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "This email is already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({ name, email, password: hashedPassword });
    const userId = user._id.toString();
    console.log("ACCESS_TOKEN_SECRET:", ACCESS_TOKEN_SECRET);
    console.log(userId);
    const token = jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET);

    // Respond with success message and token
    res.status(200).json({
      msg: "Congratulations!! Account has been created for you..",
      jwt: token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Login Handler
const login = async (req, res) => {
  try {
    const result = signinInput.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        status: false,
        msg: "Invalid input",
        errors: result.error.errors,
      });
    }

    const { email, password } = result.data;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ status: false, msg: "This email is not registered!!" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: false, msg: "Password incorrect!!" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, ACCESS_TOKEN_SECRET, {});

    // Respond with success message, token, and user info
    delete user.password; // Remove password from user object
    res.status(200).json({
      token,
      user,
      status: true,
      msg: "Login successful..",
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

module.exports = { signup, login };
