const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const secret = process.env.JWT_SECRET;

exports.generateToken = (user) => {
  return jwt.sign({ id: user.userId }, secret, { expiresIn: "1h" });
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, secret);
  } catch (e) {
    return null;
  }
};

exports.hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

exports.comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
