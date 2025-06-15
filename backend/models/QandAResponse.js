import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QandAQuiz",
    required: true,
  },
  answers: [
    {
      questionIndex: Number,
      selectedOption: Number,
      isCorrect: Boolean,
    },
  ],
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.model("QandAResponse", responseSchema);
