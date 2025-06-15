import express from "express";
import PollQuiz from "../models/PollQuiz.js";
import Quiz from "../models/Quiz.js";
import PollResponse from "../models/PollResponse.js";

const router = express.Router();

// Create a new Poll Quiz
router.post("/create", async (req, res) => {
  try {
    const { questions, optionType, quizId, quizLink } = req.body;
    console.log(questions, optionType);
    const newPoll = new PollQuiz({
      questions,
      optionType,
      quizLink,
      createdAt: new Date(),
      quizId,
    });

    await newPoll.save();
    res.status(201).json({ message: "Poll saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save poll" });
  }
});

// Get the Poll Quiz by quizLink
router.get("/get-quiz/:quizLink", async (req, res) => {
  const quizLink = req.params.quizLink;
  try {
    const quiz = await PollQuiz.findOne({ quizLink });

    if (!quiz) {
      console.log(`Poll not found for link: ${quizLink}`);
      return res.status(404).json({ message: "Poll not found" });
    }
    res.status(200).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch poll" });
  }
});

// PUT for edit Poll Quiz
router.put("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Received ID:", id);
    const { questions, optionType } = req.body;
    console.log("Request Body:", req.body);

    if (!questions || !optionType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedQuiz = await PollQuiz.findOneAndUpdate(
      { quizId: id },
      { questions, optionType, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res
      .status(200)
      .json({ message: "Poll quiz updated successfully", quiz: updatedQuiz });
  } catch (error) {
    console.error("Failed to update Poll quiz:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get analysis for a specific Poll Quiz by ID
router.get("/analysis/:quizId", async (req, res) => {
  try {
    const { quizId } = req.params;

    // First here it will find the quiz from main Quiz collection to get the link
    const mainQuiz = await Quiz.findById(quizId);
    if (!mainQuiz)
      return res
        .status(404)
        .json({ message: "Quiz not found in Quiz collection" });

    const link = mainQuiz.link;

    const pollQuiz = await PollQuiz.findOne({ quizId }).sort({ createdAt: -1 });
    if (!pollQuiz)
      return res.status(404).json({ message: "Poll quiz not found" });

    const responses = await PollResponse.find({ quizId: pollQuiz._id });

    const optionCounts = pollQuiz.questions.map((q, questionIndex) => {
      const countPerOption = q.options.map((_, optionIndex) => {
        const count = responses.filter((resp) =>
          resp.answers.some(
            (a) =>
              a.questionIndex === questionIndex &&
              a.selectedOptionIndex === optionIndex
          )
        ).length;
        return count;
      });
      return countPerOption;
    });

    const responseData = {
      name: mainQuiz.name,
      questions: pollQuiz.questions,
      optionType: pollQuiz.optionType,
      quizId: pollQuiz.quizId,
      quizLink: pollQuiz.quizLink,
      createdAt: pollQuiz.createdAt,
      optionCounts,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error in /poll/analysis/:quizId", error);
    res.status(500).json({ message: "Server error" });
  }
});

//Submit Response for Poll Quiz
router.post("/submit-response", async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    const quiz = await PollQuiz.findById(quizId);
    if (!quiz) {
      console.log("PollQuiz not found for quizId", quizId);
      return res.status(400).json({ message: "Invalid quizId" });
    }

    const newResponse = new PollResponse({
      quizId: quiz._id,
      answers,
    });

    await newResponse.save();
    res.status(201).json({ message: "Response submitted successfully" });
  } catch (error) {
    console.error("Error submitting response", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
