import express from "express";
import Quiz from "../models/Quiz.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const { name, type } = req.body;
    if (!name || !type) {
      return res
        .status(400)
        .json({ message: "Quiz name and type are required" });
    }
    const newQuiz = new Quiz({ name, type });
    await newQuiz.save();
    res
      .status(201)
      .json({ message: "Quiz created successfully", quiz: newQuiz });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

export default router;
