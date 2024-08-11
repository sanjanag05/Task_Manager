const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { ACCESS_TOKEN_SECRET } = process.env;

const verifyAccessToken = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(400).json({ status: false, msg: "Token not found" });
  }

  const header = authHeader.split(" ");
  const token = header[1];
  console.log("token", token);

  let decodedToken;
  try {
    // Verify the token and decode it
    decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
    // Log the decoded token
    console.log("Decoded token:", decodedToken);
  } catch (err) {
    // Log the error for debugging
    console.error("Token verification error:", err);
    // Respond with an error status and message
    return res.status(401).json({ status: false, msg: "Invalid token" });
  }

  // Check if decodedToken is properly defined
  if (!decodedToken || !decodedToken.id) {
    return res
      .status(401)
      .json({ status: false, msg: "Invalid token structure" });
  }

  try {
    const user = await User.findById(decodedToken.id);

    // Log the user object
    console.log("User from database:", user);

    if (!user) {
      return res.status(401).json({ status: false, msg: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Error retrieving user:", err);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

module.exports = { verifyAccessToken };
