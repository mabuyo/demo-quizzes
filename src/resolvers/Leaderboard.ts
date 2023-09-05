export const Leaderboard = {
  Leaderboard: {
    allQuizzes(_parent, _args, _context) {
      console.log("all quizzes");
      return [{ id: "11" }, { id: "22" }, { id: "33" }];
    },
  },
};
