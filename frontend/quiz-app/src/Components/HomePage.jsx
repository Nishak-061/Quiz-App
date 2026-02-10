import React, { useState } from "react";
import "../Styles/HomePage.css";
import { IoBookSharp } from "react-icons/io5";
import Home from "../Assets/Home3.svg";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import { useEffect,useRef} from "react";
import Typed from "typed.js";

const HomePage = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const typedRef=useRef(null);  //reference for typing text

  const text=`Build interactive quizzes in minutes with our easy-to-use quiz builder.<br/>Whether for learning, fun, or business, design engaging quizzes<br/>with custom questions, options, and scoring.` 

  useEffect(()=>{
    if (!typedRef.current) return;
    const typed=new Typed(typedRef.current,{
      strings:[text],
      typeSpeed:30,   //typing speed
      backSpeed:0,    //no deleting
      showCursor:false,
     // cursorChar:"|",   i am not able to execute this
      contentType:"html"
    })
    return ()=>typed.destroy();  //cleanup
  },[])

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
            <p className="quiz-sub-heading" ref={typedRef}></p>
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
