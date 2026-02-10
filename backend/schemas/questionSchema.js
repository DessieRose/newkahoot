const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    correct: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { _id: false },
);

const questionSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    question: {
      type: String,
      required: true,
    },
    answers: {
      type: [answerSchema],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length >= 2 && arr.some((answer) => answer.correct);
        },
        message:
          "Must have at least 2 answers with at least one correct answer",
      },
    },
    timeLimit: {
      type: Number,
      required: true,
      default: 20,
      min: 5,
    },
  },
  { timestamps: true },
);

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
