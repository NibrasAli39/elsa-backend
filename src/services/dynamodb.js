const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const tableNames = {
  USERS: "UserTable",
  SESSIONS: "SessionTable",
  MCQS: "McqTable",
};

exports.createUser = async (user) => {
  const params = {
    TableName: tableNames.USERS,
    Item: user,
  };
  return dynamoDB.put(params).promise();
};

exports.getUserByUsername = async (username) => {
  const params = {
    TableName: tableNames.USERS,
    IndexName: "username-index", // Ensure this index exists
    KeyConditionExpression: "username = :username",
    ExpressionAttributeValues: { ":username": username },
  };
  const result = await dynamoDB.query(params).promise();
  return result.Items[0];
};

exports.createSession = async (session) => {
  const params = {
    TableName: tableNames.SESSIONS,
    Item: session,
  };
  return dynamoDB.put(params).promise();
};

exports.getSession = async (sessionId) => {
  const params = {
    TableName: tableNames.SESSIONS,
    Key: { sessionId },
  };
  const result = await dynamoDB.get(params).promise();
  return result.Item;
};

exports.updateSession = async (session) => {
  const params = {
    TableName: tableNames.SESSIONS,
    Item: session,
  };
  return dynamoDB.put(params).promise();
};

exports.getAllMcqs = async () => {
  const params = {
    TableName: tableNames.MCQS,
  };
  const result = await dynamoDB.scan(params).promise();
  return result.Items;
};
