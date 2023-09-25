const questions = [
  {
    id: "question123",
    title: "This is a question. Read it carefully. What will you answer?",
    choices: [
      { id: "1", text: "Answer A" },
      { id: "2", text: "Answer B" },
      { id: "3", text: "Answer C" },
      { id: "4", text: "Answer D" },
    ],
  },
  {
    id: "question234",
    title: "This is another question? Please answer",
    choices: [
      { id: "1", text: "Answer AAA" },
      { id: "2", text: "Answer BBB" },
      { id: "3", text: "Answer CCC" },
      { id: "4", text: "Answer DDDD" },
    ],
  },
  {
    id: "question2343131",
    title: "This is another question? asdasdsada",
    choices: [
      { id: "1", text: "Answer AAasdsaA" },
      { id: "2", text: "Answer asd" },
      { id: "3", text: "Answer dasd" },
      { id: "4", text: "Answer DefDDD" },
    ],
  },
];

let index = 0;

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
  {
    quiz: {
      id: "1234",
    },
    list: [
      { rank: 1, name: "Fawnspirit_Aurorica472", points: 20 },
      { rank: 2, name: "Power_Lyra843", points: 18 },
      { rank: 3, name: "Flyglow_Zenitha739", points: 17 },
      { rank: 4, name: "Whitemist_Nebulae277", points: 16 },
      { rank: 5, name: "Power_Lyra145", points: 15 },
      { rank: 6, name: "Fawnspirit_Lyrisa923", points: 14 },
      { rank: 7, name: "Aspenvine_Mordecai48", points: 8 },
      { rank: 8, name: "Ina_Kael966", points: 3 },
      { rank: 8, name: "Fawnspirit_Celestria1150", points: 3 },
      { rank: 9, name: "Jaggedsight_Zorah124", points: 2 },
    ],
  },

  {
    quiz: {
      id: "1234567",
    },
    list: [
      { rank: 1, name: "Power_Lyra843", points: 30 },
      { rank: 2, name: "Fawnspirit_Aurorica472", points: 25 },
      { rank: 3, name: "Flyglow_Zenitha739", points: 20 },
    ],
  },
  {
    quiz: {
      id: "1234567",
    },
    list: [
      { rank: 1, name: "Power_Lyra843", points: 35 },
      { rank: 2, name: "Fawnspirit_Aurorica472", points: 29 },
      { rank: 3, name: "Flyglow_Zenitha739", points: 27 },
    ],
  },
];

export const Mutation = {
  Mutation: {
    postQuestion(_parent, _args, { pubsub }) {
      const currentQuestion = questions[index];
      index++;

      if (index === questions.length) {
        index = 0;
      }

      pubsub.publish("QUESTION_POSTED", {
        questionPosted: currentQuestion,
      });
      return currentQuestion;
    },
    updateLeaderboardForQuiz: async (_parent, _args, { pubsub }) => {
      const leaderboard = leaderboardUpdates[index];
      index++;

      if (index === leaderboardUpdates.length) {
        index = 0;
      }

      pubsub.publish("LEADERBOARD_UPDATED", {
        leaderboardForQuiz: leaderboard,
      });
      return leaderboard;
    },
  },
};
