import { PubSub } from "graphql-subscriptions";
import { Resolvers } from "../__generated__/resolvers-types";

export const Subscription = {
  Subscription: {
    questionPosted: {
      subscribe: async (parent, data, context) => {
        const { pubsub } = context;
        return pubsub.asyncIterator(["QUESTION_POSTED"]);
      },
    },
  },
};
