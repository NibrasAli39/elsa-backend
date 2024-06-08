const { v4: uuidv4 } = require("uuid");
const dynamoDBService = require("../services/dynamodb");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

exports.getSessions = async () => {
  const sessions = await dynamoDBService.getAllSessions();
  return sessions;
};

exports.getSession = async (_, { sessionId }) => {
  const session = await dynamoDBService.getSession(sessionId);
  return session;
};

exports.getMcqs = async () => {
  const mcqs = await dynamoDBService.getAllMcqs();
  return mcqs;
};

exports.createSession = async (_, { quizId }, { user }) => {
  if (!user) throw new Error("Not authenticated");
  const session = {
    sessionId: uuidv4(),
    quizId,
    participants: [{ userId: user.id, score: 0 }],
    scores: [],
  };
  await dynamoDBService.createSession(session);
  return session;
};

exports.joinSession = async (_, { sessionId }, { user }) => {
  if (!user) throw new Error("Not authenticated");
  const session = await dynamoDBService.getSession(sessionId);
  session.participants.push({ userId: user.id, score: 0 });
  await dynamoDBService.updateSession(session);
  pubsub.publish("SESSION_UPDATED", { session });
  return session;
};

exports.submitAnswer = async (_, { sessionId, answer }, { user }) => {
  if (!user) throw new Error("Not authenticated");
  const session = await dynamoDBService.getSession(sessionId);
  const mcq = session.mcqs.find((mcq) => mcq.id === sessionId);
  const correctAnswer = mcq.correctAnswer;
  const scoreUpdate = answer === correctAnswer ? 100 : 0;
  const participant = session.participants.find((p) => p.userId === user.id);
  participant.score += scoreUpdate;
  await dynamoDBService.updateSession(session);
  pubsub.publish("SCORE_UPDATED", { sessionId, participant });
  return session;
};
