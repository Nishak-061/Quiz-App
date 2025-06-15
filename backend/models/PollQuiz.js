import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  text: { type: String },
  image: { type: String },
});

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [optionSchema], required: true },
});

const pollQuizSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  questions: { type: [questionSchema], required: true },
  optionType: {
    type: String,
    enum: ["text", "image", "text-image"],
    required: true,
  },
  quizLink: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("PollQuiz", pollQuizSchema);
