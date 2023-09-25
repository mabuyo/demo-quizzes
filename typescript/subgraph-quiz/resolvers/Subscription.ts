import { Resolvers } from "../__generated__/resolvers-types";
import { withFilter } from "graphql-subscriptions";

export const Subscription = {
  Subscription: {
    questionPosted: {
      subscribe: async (_parent, _args, context) => {
        const { pubsub } = context;
        return pubsub.asyncIterator(["QUESTION_POSTED"]);
      },
    },
    leaderboardForQuiz: {
      subscribe: withFilter(
        (_parent, { id }, { pubsub }) =>
          pubsub.asyncIterator(["LEADERBOARD_UPDATED"]),
        (payload, variables) => {
          return variables.id === payload.leaderboardForQuiz.quiz.id;
        }
      ),
    },
  },
};
