const leaderboardUpdates = [
  {
    quiz: {
      id: "1234",
    },
    list: [
      { rank: 1, name: "Fawnspirit_Aurorica472", points: 10 },
      { rank: 2, name: "Power_Lyra843", points: 8 },
      { rank: 3, name: "Flyglow_Zenitha739", points: 7 },
      { rank: 4, name: "Whitemist_Nebulae277", points: 6 },
      { rank: 5, name: "Power_Lyra145", points: 5 },
      { rank: 6, name: "Fawnspirit_Lyrisa923", points: 4 },
      { rank: 7, name: "Aspenvine_Mordecai48", points: 3 },
      { rank: 7, name: "Ina_Kael966", points: 3 },
      { rank: 7, name: "Fawnspirit_Celestria1150", points: 3 },
      { rank: 8, name: "Jaggedsight_Zorah124", points: 2 },
    ],
  },
  {
    quiz: {
      id: "1234567",
    },
    list: [
      { rank: 1, name: "Power_Lyra843", points: 22 },
      { rank: 2, name: "Fawnspirit_Aurorica472", points: 20 },
      { rank: 3, name: "Flyglow_Zenitha739", points: 17 },
    ],
  },
];

export const Query = {
  Query: {
    allQuizzes(_parent, _args, _context) {
      return [{ id: "1234" }, { id: "1234567" }, { id: "53" }];
    },
    leaderboardForQuiz(_parent, { id }, _context) {
      return leaderboardUpdates.find((l) => l.quiz.id === id);
    },
  },
};
