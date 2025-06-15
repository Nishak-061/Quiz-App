import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/LoginPage.css";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import ForgotPassword from "./ForgotPassword";

const LoginPage = ({ closeModal, openRegister }) => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!user.email || !user.password) {
      setMessage("Both fields are required!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        user
      );
      setMessage(response.data.message);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);
      closeModal();
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="quiz-login-container">
      <div className="quiz-login-modal">
        <IoClose className="quiz-close-icon" onClick={closeModal} />
        <div className="quiz-login-heading">
          <h1 className="quiz-login-text">LOGIN</h1>
        </div>
        <div className="quiz-textbox-container">
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            className="quiz-login-inputbox"
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="quiz-login-inputbox"
            onChange={handleChange}
          />
        </div>
        <p
          className="quiz-forgot-password"
          onClick={() => setShowForgotPassword(true)}
        >
          Forgot Password?
        </p>
        {showForgotPassword && (
          <ForgotPassword closeModal={() => setShowForgotPassword(false)} />
        )}
        {message && <p className="quiz-login-error-message">{message}</p>}
        <button className="quiz-signin-btn" onClick={handleLogin}>
          Sign in
        </button>
        <p className="quiz-login-to-register">
          Don't have an account?{" "}
          <span onClick={openRegister} className="quiz-register-link">
            {" "}
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
