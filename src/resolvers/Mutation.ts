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
  },
};
