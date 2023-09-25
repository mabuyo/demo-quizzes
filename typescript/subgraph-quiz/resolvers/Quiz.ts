import { Resolvers } from "../__generated__/resolvers-types";

export const Quiz: Resolvers = {
  Quiz: {
    title(parent, _args, _context) {
      const { id } = parent;
      console.log(parent);
      // console.log(parent.$ref.key);
      return `Quiz # ${id}`;
    },
  },
};
