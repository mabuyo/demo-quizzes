import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import bodyParser from "body-parser";
const { json } = bodyParser;
import express from "express";
import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import gql from "graphql-tag";
import { readFileSync } from "fs";

interface Choice {
  id: string;
  text: string;
}

interface Question {
  id: string;
  title: string;
  choices: Choice[];
  goodAnswer: string;
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  currentQuestion: number;
}

interface Player {
  id: string;
  quizId: string;
  points: number;
}

interface Leaderboard {
  quiz: Quiz;
  list: Player[];
}

interface Response {
  success: boolean;
  rightChoice: Choice;
}

const QUIZZES: Record<string, Quiz> = {
  "0": {
    id: "0",
    title: "Subscription quiz",
    questions: [
      {
        id: "0",
        title: "How many different modes are available for subscription ?",
        choices: [
          {
            id: "0",
            text: "1",
          },
          {
            id: "1",
            text: "2",
          },
          {
            id: "2",
            text: "3",
          },
          {
            id: "3",
            text: "4",
          },
        ],
        goodAnswer: "1",
      },
      {
        id: "1",
        title:
          "How is handled the subscription connection from the client to the Router ?",
        choices: [
          {
            id: "0",
            text: "Using HTTP multipart connection",
          },
          {
            id: "1",
            text: "Using SSE",
          },
          {
            id: "2",
            text: "Using WebSocket",
          },
          {
            id: "3",
            text: "Using GRPC",
          },
        ],
        goodAnswer: "0",
      },
    ],
    currentQuestion: -1,
  },
};

const LEADERBOARD: Record<string, Record<string, number>> = {};

function getLeaderboard(quizId: string): Leaderboard {
  const leaderboardData = LEADERBOARD[quizId];
  const quiz = QUIZZES[quizId];

  const leaderboard: Leaderboard = {
    quiz,
    list: [],
  };

  if (leaderboardData) {
    leaderboard.list = Object.keys(leaderboardData).map((playerId) => ({
      id: playerId,
      quizId,
      points: leaderboardData[playerId],
    }));
  }

  return leaderboard;
}

const typeDefs = gql(readFileSync("./quiz.graphql", { encoding: "utf-8" }));

const resolvers = {
  Query: {
    allQuizzes() {
      return Object.values(QUIZZES);
    },

    leaderboardForQuiz(_: any, { id }: { id: string }) {
      return getLeaderboard(id);
    },
  },

  Mutation: {
    answer(
      _: any,
      { quizId, choiceId }: { quizId: string; choiceId: string },
      { playerId }: any
    ): Response {
      if (!playerId) {
        throw new Error("cannot find the player header");
      }

      const quiz = QUIZZES[quizId];
      if (quiz.currentQuestion < 0) {
        throw new Error("no current question");
      }

      const currentQuestion =
        quiz.questions.find(
          (question) => +question.id === quiz.currentQuestion
        ) || quiz.questions[0];
      const rightChoice =
        currentQuestion.choices.find(
          (choice) => choice.id === currentQuestion.goodAnswer
        ) || currentQuestion.choices[0];
      const increment = choiceId === rightChoice?.id ? 1 : 0;

      if (LEADERBOARD[quizId]) {
        const playerScore = LEADERBOARD[quiz.id][playerId];
        if (playerScore) {
          LEADERBOARD[quizId][playerId] += increment;
        } else {
          LEADERBOARD[quizId][playerId] = increment;
        }
      } else {
        LEADERBOARD[quizId] = { [playerId]: increment };
      }

      return {
        success: !!increment,
        rightChoice,
      };
    },

    nextQuestion(_: any, { quizId }: { quizId: string }) {
      let question: Question | undefined;
      const quiz = QUIZZES[quizId];

      if (!quiz) {
        return question;
      }

      if (quiz.currentQuestion === -1) {
        delete LEADERBOARD[quizId];
      }

      quiz.currentQuestion += 1;

      if (quiz.currentQuestion === Object.keys(quiz.questions).length) {
        quiz.currentQuestion = 0;
      }

      question = quiz.questions.find(
        (question) => +question.id === quiz.currentQuestion
      );

      return question;
    },
  },

  Subscription: {
    newQuestion: {
      subscribe: async function* (_: any, { quizId }: { quizId: string }) {
        while (true) {
          const quiz = QUIZZES[quizId];
          yield { newQuestion: quiz.questions[quiz.currentQuestion] };
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      },
    },

    leaderboardForQuiz: {
      subscribe: async function* (_: any, { id }: { id: string }) {
        while (true) {
          const leaderboard = getLeaderboard(id);
          yield { leaderboardForQuiz: leaderboard };
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      },
    },
  },
};

const app = express();
const httpServer = createServer(app);

const schema = buildSubgraphSchema({ typeDefs, resolvers });
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/",
});
const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await server.start();
app.use(
  "/",
  cors(),
  json(),
  expressMiddleware(server, {
    async context({ req }) {
      return {
        playerId: req.headers.player,
      };
    },
  })
);

const PORT = 4005;
httpServer.listen(PORT, () => {
  console.log(`🚀 Quiz subgraph ready at http://localhost:${PORT}/`);
});
