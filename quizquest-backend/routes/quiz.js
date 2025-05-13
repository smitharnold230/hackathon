import express from "express";
import Quiz from "../models/Quiz.js";

const router = express.Router();

// Get all quizzes
router.get("/", async (req, res) => {
  const quizzes = await Quiz.find();
  res.json(quizzes);
});

// Create a new quiz
router.post("/", async (req, res) => {
  const quiz = new Quiz(req.body);
  await quiz.save();
  res.json(quiz);
});

// Get quiz by ID
router.get("/:id", async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).json({ error: "Quiz not found" });
  res.json(quiz);
});

export default router;