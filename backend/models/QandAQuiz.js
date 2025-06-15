import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  text: { type: String },
  image: { type: String },
});

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [optionSchema], required: true },
  timer: { type: Number, default: 0 },
  correctAnswer: { type: Number, required: true },
});

const qandaQuizSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  questions: { type: [questionSchema], required: true },
  optionType: {
    type: String,
    enum: ["text", "image", "text-image"],
    required: true,
  },
  link: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("QandAQuiz", qandaQuizSchema);
