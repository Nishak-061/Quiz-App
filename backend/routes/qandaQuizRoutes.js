import express from "express";
import QandAQuiz from "../models/QandAQuiz.js";
import Quiz from "../models/Quiz.js";
import QandAResponse from "../models/QandAResponse.js";

const router = express.Router();

//Create new QandA Quiz
router.post("/create", async (req, res) => {
  try {
    const { questions, optionType, link, quizId } = req.body;

    if (!questions || !optionType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newQuiz = new QandAQuiz({
      questions,
      optionType,
      link,
      quizId,
    });
    await newQuiz.save();
    res
      .status(201)
      .json({ message: "Quiz created successfully", quiz: newQuiz });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;

// Fetch Q&A quiz by link
router.get("/get-quiz/:link", async (req, res) => {
  try {
    // const link = `http://localhost:5173/qanda-quiz-interface/${req.params.link}`;
    const quiz = await QandAQuiz.findOne({ link: req.params.link });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.status(200).json({ quiz });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PUT - Edit Q&A Quiz
router.put("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Received ID:", id);
    const { questions, optionType } = req.body;
    console.log("Request Body:", req.body);

    if (!questions || !optionType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    questions.forEach((question, index) => {
      if (question.timer && typeof question.timer === "number") {
        questions[index].timer = question.timer;
      }
    });

    const updatedQuiz = await QandAQuiz.findOneAndUpdate(
      { quizId: id },
      { questions, optionType, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res
      .status(200)
      .json({ message: "Q&A quiz updated successfully", quiz: updatedQuiz });
  } catch (error) {
    console.error("Failed to update Q&A quiz:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/analysis/:quizId", async (req, res) => {
  const { quizId } = req.params;
  try {
    const quizMeta = await Quiz.findById(quizId);

    if (!quizMeta) return res.status(404).json({ message: "Quiz not found" });

    const qandaData = await QandAQuiz.findOne({ quizId });
    if (!qandaData)
      return res.status(404).json({ message: "Q&A data not found" });
    const responses = await QandAResponse.find({ quizId: qandaData._id });

    const questionStats = qandaData.questions.map((q, idx) => {
      const attempts = responses.filter((r) =>
        r.answers.some((a) => a.questionIndex === idx)
      );
      const correct = attempts.filter(
        (r) => r.answers.find((a) => a.questionIndex === idx)?.isCorrect
      ).length;
      const total = attempts.length;

      return {
        question: q.question,
        options: q.options,
        correctCount: correct,
        incorrectCount: total - correct,
        totalAttempts: total,
      };
    });

    res.json({
      name: quizMeta.name,
      questions: questionStats,
      optionType: qandaData.optionType,
      createdAt: quizMeta.createdAt,
    });
  } catch (error) {
    console.error("Error fetching Q&A analysis:", error);
    res.status(500).json({ message: "Failed to fetch analysis" });
  }
});

router.post("/save-response", async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const newResponse = new QandAResponse({ quizId, answers });
    await newResponse.save();
    res.status(201).json({ message: "Response saved" });
  } catch (error) {
    console.error("Error saving response:", error);
    res.status(500).json({ message: "Error saving response" });
  }
});
