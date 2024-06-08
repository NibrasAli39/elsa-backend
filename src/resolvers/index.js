const userResolvers = require("./userResolver");
const sessionResolvers = require("./sessionResolver");

const resolvers = {
  Query: {
    me: userResolvers.me,
    sessions: sessionResolvers.getSessions,
    session: sessionResolvers.getSession,
    mcqs: sessionResolvers.getMcqs,
  },
  Mutation: {
    register: userResolvers.register,
    login: userResolvers.login,
    createSession: sessionResolvers.createSession,
    joinSession: sessionResolvers.joinSession,
    submitAnswer: sessionResolvers.submitAnswer,
  },
};

module.exports = resolvers;
