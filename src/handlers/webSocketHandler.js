const AWS = require("aws-sdk");
const dynamoDBService = require("../services/dynamodb");

const apigatewaymanagementapi = new AWS.ApiGatewayManagementApi({
  endpoint: process.env.WEBSOCKET_ENDPOINT,
});

const sendToConnection = async (connectionId, payload) => {
  await apigatewaymanagementapi
    .postToConnection({
      ConnectionId: connectionId,
      Data: JSON.stringify(payload),
    })
    .promise();
};

exports.connect = async (event) => {
  console.log("WebSocket connected:", event.requestContext.connectionId);
  return { statusCode: 200, body: "Connected" };
};

exports.disconnect = async (event) => {
  console.log("WebSocket disconnected:", event.requestContext.connectionId);
  return { statusCode: 200, body: "Disconnected" };
};

exports.default = async (event) => {
  console.log(
    "WebSocket default message:",
    event.requestContext.connectionId,
    event.body
  );
  const message = JSON.parse(event.body);
  // Handle incoming WebSocket messages here
  if (message.action === "joinSession") {
    const { sessionId, userId } = message.data;
    const session = await dynamoDBService.getSession(sessionId);
    session.participants.push({ userId, score: 0 });
    await dynamoDBService.updateSession(session);
    await sendToConnection(event.requestContext.connectionId, {
      action: "sessionJoined",
      session,
    });
  }
  return { statusCode: 200, body: "Message received" };
};
