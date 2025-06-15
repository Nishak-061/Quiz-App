import React, { useState } from "react";
import "../Styles/HomePage.css";
import { IoBookSharp } from "react-icons/io5";
import Home from "../Assets/Home.png";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

const HomePage = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <div className="quiz-homepage">
      <div className="quiz-navbar-container">
        <div className="quiz-navbar-heading">
          <div className="quiz">
            <h1>
              <IoBookSharp className="quiz-icon" /> <span>Quizzie</span>
            </h1>
          </div>
          <div className="quiz-buttons">
            <button className="quiz-login" onClick={() => setIsLoginOpen(true)}>
              Login
            </button>
            <button
              className="quiz-registration"
              onClick={() => setIsRegisterOpen(true)}
            >
              Registration
            </button>
          </div>
        </div>

        <div className="quiz-main-content-container">
          <div className="quiz-text-container">
            <h1 className="quiz-heading-main-title">
              Create & Customize <br /> Your Own Quizzes Easily!
            </h1>
            <p className="quiz-sub-heading">
              Build interactive quizzes in minutes with our easy-to-use quiz
              builder.
              <br /> Whether for learning, fun, or business, design engaging
              quizzes
              <br /> with custom questions, options, and scoring.
            </p>
          </div>
          <img src={Home} alt="quiz" className="quiz-home-image" />
        </div>

        {isLoginOpen && (
          <LoginPage
            closeModal={() => setIsLoginOpen(false)}
            openRegister={() => {
              setIsLoginOpen(false);
              setIsRegisterOpen(true);
            }}
          />
        )}
        {isRegisterOpen && (
          <RegisterPage
            closeModal={() => setIsRegisterOpen(false)}
            openLogin={() => {
              setIsRegisterOpen(false);
              setIsLoginOpen(true);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
