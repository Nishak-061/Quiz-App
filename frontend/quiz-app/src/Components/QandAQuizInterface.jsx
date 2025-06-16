import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../Styles/QandAQuizInterface.css";

const QandAQuizInterface = () => {
  const { quizLink } = useParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(
          `https://quiz-app-backend-s3ov.onrender.com/api/qanda/get-quiz/${quizLink}`
        );
        setQuizData(response.data.quiz);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizLink]);

  useEffect(() => {
    if (!quizData) return;
    const currentQ = quizData.questions[currentQuestionIndex];

    if (!currentQ) return;

    if (intervalId) {
      clearInterval(intervalId);
    }

    if (currentQ.timer && currentQ.timer > 0) {
      setTimer(currentQ.timer);

      const id = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(id);
            handleAutoNext();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setIntervalId(id);

      return () => clearInterval(id);
    } else {
      setTimer(0);
    }
  }, [quizData, currentQuestionIndex]);

  const handleAutoNext = () => {
    setSelectedOptions((prev) => {
      if (prev[currentQuestionIndex] === undefined) {
        return { ...prev, [currentQuestionIndex]: null };
      }
      return prev;
    });

    const nextIndex = currentQuestionIndex + 1;
    if (quizData && nextIndex < quizData.questions.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      handleSubmit();
    }
  };

  const handleOptionSelect = (optionIndex) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleSubmit = async () => {
    let answers = [];

    quizData.questions.forEach((question, index) => {
      const selected = selectedOptions[index];
      const correct = question.correctAnswer;

      answers.push({
        questionIndex: index,
        selectedOption: selected,
        isCorrect: selected !== undefined && selected === correct,
      });
    });

    try {
      await axios.post("https://quiz-app-backend-s3ov.onrender.com/api/qanda/save-response", {
        quizId: quizData._id,
        answers,
      });
    } catch (err) {
      console.error("Failed to save response", err);
    }

    const score = answers.filter((a) => a.isCorrect).length;
    navigate("/score-qanda", {
      state: { score, total: quizData.questions.length },
    });
  };

  if (loading) return <p>Loading...</p>;
  if (!quizData) return <p>Quiz not found!</p>;

  const currentQuestion = quizData?.questions?.[currentQuestionIndex];

  if (!currentQuestion) {
    return <p>Loading next question...</p>;
  }

  return (
    <div className="qanda-quiz-interface-modal">
      <div className="qanda-quiz-interface-container">
        <div className="qanda-quiz-interface-number-time">
          <p className="qanda-quiz-interface-para-text">
            {currentQuestionIndex + 1 <= quizData.questions.length
              ? currentQuestionIndex + 1
              : quizData.questions.length}
            /{quizData.questions.length}
          </p>

          {currentQuestion && currentQuestion.timer > 0 && (
            <p className="qanda-quiz-interface-timer">
              {" "}
              {timer > 0 ? timer : "Time's up!"}
            </p>
          )}
        </div>

        {currentQuestion && (
          <div className="qanda-quiz-interface-question-option-container">
            <h2 className="qanda-quiz-interface-question">
              Q{currentQuestionIndex + 1}. {currentQuestion.question}
            </h2>
            <ul
              className={`qanda-quiz-interface-option-ul option-count-${currentQuestion.options.length}`}
            >
              {currentQuestion.options.map((opt, index) => (
                <li
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  className={`qanda-quiz-interface-option-item-list ${
                    selectedOptions[currentQuestionIndex] === index
                      ? "selected"
                      : ""
                  }`}
                >
                  {opt.image && opt.text ? (
                    <div className="qanda-quiz-interface-text-image-option-box">
                      <div className="qanda-quiz-interface-image-box">
                        <img
                          src={opt.image}
                          alt="option"
                          className="qanda-quiz-interface-image"
                        />
                      </div>
                      <div className="qanda-quiz-interface-text-box">
                        <span className="qanda-quiz-interface-option-item">
                          {opt.text}
                        </span>
                      </div>
                    </div>
                  ) : opt.image ? (
                    <img
                      src={opt.image}
                      alt="option"
                      className="qanda-quiz-interface-image"
                    />
                  ) : (
                    <span className="qanda-quiz-interface-option-item">
                      {opt.text}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="qanda-quiz-interface-next-submit-container">
          <button
            onClick={
              currentQuestionIndex < quizData.questions.length - 1
                ? handleNext
                : handleSubmit
            }
            className={
              currentQuestionIndex < quizData.questions.length - 1
                ? "qanda-quiz-interface-next-btn"
                : "qanda-quiz-interface-submit-btn"
            }
            disabled={
              currentQuestion &&
              currentQuestion.timer > 0 &&
              selectedOptions[currentQuestionIndex] === undefined
            }
          >
            {" "}
            {currentQuestionIndex < quizData.questions.length - 1
              ? "Next"
              : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QandAQuizInterface;
