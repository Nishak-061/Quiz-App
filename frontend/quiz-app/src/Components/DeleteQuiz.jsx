import React from "react";
import "../Styles/DeleteQuiz.css";

const DeleteQuiz = ({ onDelete, onCancel }) => {
  return (
    <div className="delete-quiz-modal">
      <div className="delete-quiz-container">
        <div className="delete-quiz-heading">
          <p className="delete-quiz-confirm">
            Are you sure want to delete these quiz?
          </p>
        </div>
        <div className="delete-quiz-buttons">
          <button className="delete-quiz-btn-delete" onClick={onDelete}>
            Delete
          </button>
          <button className="delete-quiz-btn-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteQuiz;
