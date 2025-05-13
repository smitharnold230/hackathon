import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";
import quizRoutes from "./routes/quiz.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use("/api/user", userRoutes);
app.use("/api/quizzes", quizRoutes);

app.get("/", (req, res) => {
  res.send("QuizQuest backend is running!");
});

app.listen(5000, () => console.log("Server running on port 5000"));