import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  category: String,
  type: String,
  difficulty: String,
  question: String,
  correct_answer: String,
  incorrect_answers: [String],
  answers: [String],
});

const quizSchema = new mongoose.Schema({
  title: String,
  description: String,
  difficulty: String,
  category: String,
  questions: [questionSchema],
  image: String,
  tags: [String],
  createdBy: String,
});

export default mongoose.model("Quiz", quizSchema);