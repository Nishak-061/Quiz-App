import express from "express";
import Quiz from "../models/Quiz.js";
import QandAQuiz from "../models/QandAQuiz.js";
import PollQuiz from "../models/PollQuiz.js";

const router = express.Router();

// Fetching all quizzes in the get
router.get("/all-quizzes", async (req, res) => {
  try {
    const quizzes = await Quiz.find();

    //fetch the quiz related Q&A or Poll quiz data
    const enrichedQuizzes = await Promise.all(
      quizzes.map(async (quiz) => {
        let linkedData = null;

        if (quiz.type === "Q&A") {
          linkedData = await QandAQuiz.findOne({ quizId: quiz._id });
          return {
            ...quiz.toObject(),
            link: linkedData?.link || null,
            questions: linkedData?.questions || [],
            optionType: linkedData?.optionType || null,
          };
        } else if (quiz.type === "Poll") {
          linkedData = await PollQuiz.findOne({ quizId: quiz._id });
          return {
            ...quiz.toObject(),
            link: linkedData?.quizLink || null,
            questions: linkedData?.questions || [],
            optionType: linkedData?.optionType || null,
          };
        }

        return quiz.toObject();
      })
    );

    res.json(enrichedQuizzes);
  } catch (error) {
    console.error("Error fetching quizzes with links:", error);
    res.status(500).json({ message: error.message });
  }
});

//Here fetching the Quiz Counts of Q&A or Poll
router.get("/quiz-counts", async (req, res) => {
  try {
    const total = await Quiz.countDocuments();
    const qandaCount = await Quiz.countDocuments({ type: "Q&A" });
    const pollCount = await Quiz.countDocuments({ type: "Poll" });

    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const totalThisMonth = await Quiz.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    const qandaThisMonth = await Quiz.countDocuments({
      type: "Q&A",
      createdAt: { $gte: startOfMonth },
    });

    const pollThisMonth = await Quiz.countDocuments({
      type: "Poll",
      createdAt: { $gte: startOfMonth },
    });

    res.json({
      total,
      qandaCount,
      pollCount,
      totalThisMonth,
      qandaThisMonth,
      pollThisMonth,
    });
  } catch (error) {
    console.log("Error fetching quiz counts:", error);
    res.status(500).json({ message: "Failed to fetch quiz counts" });
  }
});

// Delete a quiz
router.delete("/:id", async (req, res) => {
  const quizId = req.params.id;
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Here it deletes the Q&A or Poll quiz data
    if (quiz.type === "Q&A") {
      await QandAQuiz.deleteOne({ quizId });
    } else if (quiz.type === "Poll") {
      await PollQuiz.deleteOne({ quizId });
    }

    await Quiz.findByIdAndDelete(quizId); //here it deletes the direct main quiz
    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ message: "Failed to delete quiz" });
  }
});

export default router;
