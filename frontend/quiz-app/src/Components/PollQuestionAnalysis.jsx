import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import "../Styles/PollQuestionAnalysis.css";
import { useParams } from "react-router-dom";

const PollQuestionAnalysis = ({ quizId }) => {
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/pollQuiz/analysis/${quizId}`
        );
        console.log("quizId:", quizId);
        console.log("response data:", response.data);
        setQuizData(response.data);
      } catch (error) {
        console.log("Error fetching analysis", error);
      }
    };
    fetchQuizDetails();
  }, [quizId]);

  if (!quizData) return <div>Loading...</div>;

  return (
    <div className="poll-question-analysis-container">
      <div className="poll-question-analysis-heading-date">
        <h1 className="poll-question-analysis-heading">
          {quizData.name} Question Analysis
        </h1>
        <p className="poll-question-analysis-date">
          Created on:{" "}
          {new Date(quizData.createdAt).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="poll-question-analysis-ul-li-container">
        <ul className="poll-question-analysis-ul-container">
          {quizData.questions.map((q, index) => (
            <div key={index} className="poll-question-analysis-list-container">
              <li className="poll-question-analysis-list">
                <p className="poll-question-analysis-li-text">
                  Q.{index + 1} {q.question}
                </p>

                <div className="poll-question-analysis-count-label">
                  {q.options.map((opt, i) => (
                    <div key={i} className="poll-question-analysis-li">
                      <span className="poll-question-analysis-option-count">
                        {quizData.optionCounts?.[index]?.[i] || 0}
                      </span>
                      <span className="poll-question-analysis-option-label">
                        {" "}
                        Option {i + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </li>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PollQuestionAnalysis;
