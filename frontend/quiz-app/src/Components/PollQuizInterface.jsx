import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../Styles/PollQuizInterface.css";
import axios from "axios";

const PollQuizInterface = () => {
  const { quizLink } = useParams();
  const navigate = useNavigate();
  const [pollData, setPollData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    console.log("Fetching quiz data for:", quizLink);
    const fetchPollData = async () => {
      try {
        const response = await axios.get(
          `https://quiz-app-backend-s3ov.onrender.com/api/pollQuiz/get-quiz/${quizLink}`
        );

        setPollData(response.data);
      } catch (error) {
        console.error("Error fetching poll data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPollData();
  }, [quizLink]);

  const handleOptionClick = (index) => {
    setSelectedOption(index);
  };

  const handleNextOrSubmit = async () => {
    const updatedResponses = [
      ...responses,
      {
        questionIndex: currentQuestionIndex,
        selectedOptionIndex: selectedOption,
      },
    ];
    setResponses(updatedResponses);

    if (currentQuestionIndex < pollData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      try {
        await axios.post("https://quiz-app-backend-s3ov.onrender.com/api/pollQuiz/submit-response", {
          quizId: pollData._id,
          answers: updatedResponses,
        });

        navigate("/thanks-poll");
      } catch (error) {
        console.log("Failed to submit response:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!pollData) {
    return <div>Poll not found</div>;
  }

  const currentQuestion = pollData.questions[currentQuestionIndex];

  return (
    <div className="poll-quiz-interface-modal">
      <div className="poll-quiz-interface-container">
        <p className="poll-quiz-interface-para-text">
          {currentQuestionIndex + 1}/{pollData.questions.length}
        </p>

        <div className="poll-quiz-interface-question-option-container">
          <h2 className="poll-quiz-interface-question">
            Q{currentQuestionIndex + 1}. {currentQuestion.question}
          </h2>
          <div
            className={`poll-quiz-interface-option-item option-count-${currentQuestion.options.length}`}
          >
            {currentQuestion.options.map((opt, idx) => (
              <div
                key={idx}
                className={`poll-quiz-interface-option ${
                  selectedOption === idx ? "selected" : ""
                }`}
                onClick={() => handleOptionClick(idx)}
              >
                {pollData.optionType === "text" && (
                  <p className="poll-quiz-interface-text-item">{opt.text}</p>
                )}
                {pollData.optionType === "image" && (
                  <img
                    src={opt.image}
                    alt={`option-${idx}`}
                    className="poll-quiz-interface-image-item"
                  />
                )}
                {pollData.optionType === "text-image" && (
                  <div className="poll-quiz-interface-text-image-item">
                    <img
                      src={opt.image}
                      alt={`option-${idx}`}
                      className="poll-quiz-interface-text-image-img"
                    />
                    <p className="poll-quiz-interface-text-image-text">
                      {opt.text}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleNextOrSubmit}
          className="poll-quiz-interface-next-submit-button"
        >
          {currentQuestionIndex === pollData.questions.length - 1
            ? "Submit"
            : "Next"}
        </button>
      </div>
    </div>
  );
};

export default PollQuizInterface;
