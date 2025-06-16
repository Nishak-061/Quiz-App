import React, { useState } from "react";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import Swal from "sweetalert2";
import "../Styles/ForgotPassword.css";

const ForgotPassword = ({ closeModal }) => {
  const [form, setForm] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.email || !form.newPassword || !form.confirmPassword) {
      setMessage("All fields are required!");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "https://quiz-app-backend-s3ov.onrender.com/api/auth/forgot-password",
        {
          email: form.email,
          newPassword: form.newPassword,
        }
      );
      Swal.fire({
        icon: "success",
        title: "Password Updated Successfully",
        text: res.data.message,
        timer: 2000,
        showConfirmButton: false,
      });
      setTimeout(() => closeModal(), 2000);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-modal">
        <IoClose className="forgot-password-close-icon" onClick={closeModal} />
        <div className="forgot-password-heading">
          <h2 className="forgot-password-text">FORGOT PASSWORD</h2>
        </div>
        <div className="forgot-password-textbox-container">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="forgot-password-email-textbox"
            onChange={handleChange}
          />
          <input
            type="password"
            name="newPassword"
            placeholder="Enter your new password"
            className="forgot-new-password-textbox"
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            className="forgot-confirm-password-textbox"
            onChange={handleChange}
          />
        </div>
        {message && <p className="forgot-password-error-message">{message}</p>}
        <div className="forgot-password-submit-btn-container">
          <button className="forgot-password-submit-btn" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
