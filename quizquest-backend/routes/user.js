import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    // Create and save new user
    const user = new User({
      username: email, // or use a separate username field
      name,
      email,
      password, // In production, hash the password!
      xp: 0,
      streak: 1,
      level: 1,
      completedQuizzes: [],
      recentAchievements: [],
      dailyChallenges: [],
      leaderboard: [],
    });
    
    await user.save();
    res.json({ message: 'User registered', user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Get user stats
router.get("/:username", async (req, res) => {
  let user = await User.findOne({ username: req.params.username });
  if (!user) {
    // Create a new user with some default data
    user = new User({
      username: req.params.username,
      name: req.params.username,
      xp: 0,
      streak: 1,
      level: 1,
      completedQuizzes: [],
      recentAchievements: [],
      dailyChallenges: [],
      leaderboard: [],
    });
    await user.save();
  }
  res.json(user);
});

// Update user XP
router.post("/:username/xp", async (req, res) => {
  const { xp } = req.body;
  const user = await User.findOneAndUpdate(
    { username: req.params.username },
    { $inc: { xp } },
    { new: true }
  );
  res.json(user);
});

// Add completed quiz to user
router.post("/:username/completed", async (req, res) => {
  const quiz = req.body;
  const user = await User.findOneAndUpdate(
    { username: req.params.username },
    { $push: { completedQuizzes: quiz } },
    { new: true }
  );
  res.json(user);
});

// Add achievement to user
router.post("/:username/achievement", async (req, res) => {
  const achievement = req.body;
  const user = await User.findOneAndUpdate(
    { username: req.params.username },
    { $push: { recentAchievements: achievement } },
    { new: true }
  );
  res.json(user);
});

export default router;