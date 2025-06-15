import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PollQuiz",
    required: true,
  },
  answers: [
    {
      questionIndex: { type: Number, required: true },
      selectedOptionIndex: { type: Number, required: true },
    },
  ],
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.model("PollResponse", responseSchema);
