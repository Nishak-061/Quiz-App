import React, { useState } from "react";
import "../Styles/createQuiz.css";
import QandA from "./QandA";
import PollType from "./PollType";
import axios from "axios";

const CreateQuiz = ({ closeModel }) => {
  const [quizName, setQuizName] = useState("");
  const [quizType, setQuizType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quizId, setQuizId] = useState(null);

  const handleContinue = async () => {
    if (quizName && quizType) {
      try {
        const response = await axios.post(
          "https://quiz-app-backend-m5sm.onrender.com/api/quiz/create",
          {
            name: quizName,
            type: quizType,
          }
        );
        const createdQuizId = response.data.quiz._id;
        setQuizId(createdQuizId);
        console.log(response.data);
        setIsModalOpen(true);
      } catch (error) {
        console.error(
          "Error creating quiz:",
          error.response?.data || error.message
        );
      }
    }
  };

  return (
    <>
      {!isModalOpen ? (
        <div className="create-quiz-modal">
          <div className="create-quiz-container">
            <div className="create-quiz-input">
              <input
                type="text"
                placeholder="Quiz name"
                className="create-quiz-input-box"
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
              />
            </div>
            <div className="create-quiz-type-items">
              <p className="create-quiz-type-text">Quiz Type</p>
              <button
                className={`create-quiz-type-button ${
                  quizType === "Q&A" ? "selected" : ""
                }`}
                onClick={() => setQuizType("Q&A")}
              >
                Q & A
              </button>
              <button
                className={`create-quiz-type-button ${
                  quizType === "Poll" ? "selected" : ""
                }`}
                onClick={() => setQuizType("Poll")}
              >
                Poll Type
              </button>
            </div>
            <div className="create-quiz-cancel-continue-btn">
              <button
                className="create-quiz-cancel-button"
                onClick={closeModel}
              >
                Cancel
              </button>
              <button
                className="create-quiz-continue-button"
                onClick={handleContinue}
                disabled={!quizName || !quizType}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      ) : quizType === "Q&A" ? (
        <QandA
          closeModel={() => setIsModalOpen(false)}
          quizName={quizName}
          quizId={quizId}
        />
      ) : (
        <PollType closeModel={() => setIsModalOpen(false)} quizId={quizId} />
      )}
    </>
  );
};

export default CreateQuiz;
