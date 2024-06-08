const { v4: uuidv4 } = require("uuid");
const dynamoDBService = require("../services/dynamodb");
const {
  generateToken,
  hashPassword,
  comparePassword,
} = require("../utils/auth");

exports.register = async (_, { username, password }) => {
  const hashedPassword = await hashPassword(password);
  const user = {
    userId: uuidv4(),
    username,
    password: hashedPassword,
  };
  await dynamoDBService.createUser(user);
  return generateToken(user);
};

exports.login = async (_, { username, password }) => {
  const user = await dynamoDBService.getUserByUsername(username);
  if (!user) throw new Error("User not found");
  const isValid = await comparePassword(password, user.password);
  if (!isValid) throw new Error("Invalid password");
  return generateToken(user);
};

exports.me = async (_, __, { user }) => {
  if (!user) throw new Error("Not authenticated");
  return user;
};
