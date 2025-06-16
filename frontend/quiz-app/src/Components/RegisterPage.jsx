import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import "../Styles/RegisterPage.css";

const RegisterPage = ({ closeModal, openLogin }) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!user.name || !user.email || !user.password || !user.confirmPassword) {
      setMessage("All fields are required!");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        user
      );
      setMessage(response.data.message);
      localStorage.setItem("token", response.data.token);
      closeModal();
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="quiz-register-container">
      <div className="quiz-register-modal">
        <IoClose className="quiz-register-close-icon" onClick={closeModal} />
        <div className="quiz-register-heading">
          <h1 className="quiz-register-text">REGISTER</h1>
        </div>
        <div className="quiz-register-textbox-container">
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            className="quiz-register-inputbox"
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            className="quiz-register-inputbox"
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            className="quiz-register-inputbox"
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Enter Confirm Password"
            className="quiz-register-inputbox"
            onChange={handleChange}
          />
        </div>
        {message && <p className="quiz-register-error-message">{message}</p>}
        <button className="quiz-register-btn" onClick={handleRegister}>
          Register
        </button>
        <p className="quiz-register-to-login">
          Have an account?{" "}
          <span onClick={openLogin} className="quiz-login-link">
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
