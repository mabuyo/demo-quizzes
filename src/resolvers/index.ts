import { Query } from "./Query";
import { Mutation } from "./Mutation";
import { Subscription } from "./Subscription";
import { Quiz } from "./Quiz";

const resolvers = {
  ...Query,
  ...Quiz,
  ...Mutation,
  ...Subscription,
};

export default resolvers;
