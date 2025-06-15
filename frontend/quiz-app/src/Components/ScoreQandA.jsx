import React from "react";
import { useLocation } from "react-router-dom";
import trophy from "../Assets/trophy.jpg";
import "../Styles/ScoreQandA.css";

const ScoreQandA = () => {
  const location = useLocation();
  const { score, total } = location.state || { score: 0, total: 0 };

  return (
    <div className="score-qanda-modal">
      <div className="score-qanda-container">
        <h1 className="score-qanda-heading">Congrats Quiz Is Completed</h1>
        <div className="score-qanda-image">
          <img src={trophy} alt="trophy" className="score-qanda-trophy-image" />
        </div>
        <div className="score-qanda-number">
          <p className="score-qanda-para-text">
            Your Score is{" "}
            <span className="score-qanda-para-span">
              {" "}
              {score}/{total}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScoreQandA;
