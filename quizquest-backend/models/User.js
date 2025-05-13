import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema({
  id: String,
  icon: String,
  title: String,
  description: String,
  date: String,
  xp: Number,
});

const challengeSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  reward: Number,
  progress: Number,
  total: Number,
});

const leaderboardItemSchema = new mongoose.Schema({
  id: String,
  rank: Number,
  name: String,
  points: Number,
  isUser: Boolean,
});

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  name: String,
  email: { type: String, unique: true },
  password: String,
  xp: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  completedQuizzes: [
    {
      id: String,
      title: String,
      description: String,
      questions: Number,
      image: String,
      tags: [String],
    },
  ],
  recentAchievements: [achievementSchema],
  dailyChallenges: [challengeSchema],
  leaderboard: [leaderboardItemSchema],
});

export default mongoose.model("User", userSchema);