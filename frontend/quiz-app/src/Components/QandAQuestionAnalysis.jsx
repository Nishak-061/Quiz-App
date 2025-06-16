import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../Styles/QandAQuestionAnalysis.css";
import axios from "axios";

const QandAQuestionAnalysis = ({ quizId }) => {
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const response = await axios.get(
          `https://quiz-app-backend-s3ov.onrender.com/api/qanda/analysis/${quizId}`
        );
        setQuizData(response.data);
      } catch (error) {
        console.error("Error fetching analysis:", error);
      }
    };

    fetchQuizDetails();
  }, [quizId]);

  if (!quizData) return <div>Loading...</div>;

  return (
    <div className="qanda-question-analysis-container">
      <div className="qanda-question-analysis-heading-date">
        <h1 className="qanda-question-analysis-heading">
          {quizData.name} Question Analysis{" "}
        </h1>
        <p className="qanda-question-analysis-date">
          Created on:{" "}
          {new Date(quizData.createdAt).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="qanda-question-analysis-ul-li-container">
        <ul className="qanda-question-analysis-ul-container">
          {quizData.questions.map((q, index) => (
            <div key={index} className="qanda-question-analysis-list-container">
              <li className="qanda-question-analysis-list">
                <p className="qanda-question-analysis-li-text">
                  Q{index + 1} {q.question}
                </p>
                <div className="qanda-question-analysis-count-attempted">
                  <div className="qanda-question-analysis-attempted">
                    <p className="qanda-question-analysis-total-attempted">
                      {q.totalAttempts}
                    </p>
                    <span className="qanda-question-analysis-people-attempted">
                      Attempted the question
                    </span>
                  </div>

                  <div className="qanda-question-analysis-correctly">
                    <p className="qanda-question-analysis-correctly-count">
                      {q.correctCount}
                    </p>
                    <span className="qanda-question-analysis-correctly-ans">
                      Answered correctly
                    </span>
                  </div>

                  <div className="qanda-question-analysis-incorrectly">
                    <p className="qanda-question-analysis-incorrectly-count">
                      {q.incorrectCount}{" "}
                    </p>
                    <span className="qanda-question-analysis-incorrectly-ans">
                      Answered incorrectly
                    </span>
                  </div>
                </div>
              </li>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QandAQuestionAnalysis;
