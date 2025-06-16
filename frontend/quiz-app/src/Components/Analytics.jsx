import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrashAlt, FaShareAlt } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import "../Styles/Analytics.css";
import QandA from "./QandA";
import PollType from "./PollType";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteQuiz from "./DeleteQuiz";

const Analytics = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizType, setQuizType] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/quizzes/all-quizzes"
        );
        console.log("Fetched quizzes:", response.data);
        setQuizzes(response.data);
        setFilteredQuizzes(response.data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);

  useEffect(() => {
    if(searchTerm.trim() === "") {
      setFilteredQuizzes(quizzes);
    } else {
      const filtered = quizzes.filter(
        (quiz) => 
          quiz.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          quiz.type.toLowerCase().includes(searchTerm.toLocaleLowerCase())
      );
      setFilteredQuizzes(filtered);
    }
  }, [searchTerm, quizzes]);

  const handleCopyLink = (quiz) => {
    let path = "";
    if (!quiz.link) {
      toast.error("Quiz link not available");
      return;
    }
    if (quiz.link.startsWith("http")) {
      path = quiz.link;
    } else {
      if (quiz.type === "Q&A") {
        path = `${window.location.origin}/qanda-quiz-interface/${quiz.link}`;
      } else if (quiz.type === "Poll") {
        path = `${window.location.origin}/poll-quiz-interface/${quiz.link}`;
      } else {
        toast.error("Unknown quiz type");
        return;
      }
    }
    navigator.clipboard
      .writeText(path)
      .then(() => {
        toast.success("Link copied successfully!");
        console.log("Full URL copied:", path);
      })
      .catch((err) => {
        console.error("Copy failed:", err);
        toast.error("Failed to copy link.");
      });
  };

  const handleDeleteClick = (quizId) => {
    setQuizToDelete(quizId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/quizzes/${quizToDelete}`);
      setQuizzes((prev) => prev.filter((quiz) => quiz._id !== quizToDelete));
      toast.success("Quiz deleted successfully!");
    } catch (error) {
      console.error("Failed to delete quiz:", error);
      toast.error("Failed to delete quiz. Please try again.");
    } finally {
      setDeleteModalOpen(false);
      setQuizToDelete(null);
    }
  };

  const handleEditQuiz = async (quiz) => {
    try {
      if (quiz.type === "Q&A") {
        const linkParts = quiz.link.split("/");
        const uniqueLink = linkParts[linkParts.length - 1];
        const response = await axios.get(
          `http://localhost:8080/api/qanda/get-quiz/${uniqueLink}`
        );
        const quizData = response.data.quiz;

        setSelectedQuiz({
          ...quizData,
          name: quiz.name,
          _id: quiz._id,
        });
        setQuizType("Q&A");
        setIsModalOpen(true);
      } else if (quiz.type === "Poll") {
        console.log("Editing Poll quiz", quiz);
        const linkParts = quiz.link.split("/");
        const uniqueLink = linkParts[linkParts.length - 1];
        const response = await axios.get(
          `http://localhost:8080/api/pollQuiz/get-quiz/${uniqueLink}`
        );
        console.log("Setting modal open for Poll", response.data.quiz);
        setSelectedQuiz({
          ...response.data,
          name: quiz.name,
          _id: quiz._id,
        });
        setQuizType("Poll");
        setIsModalOpen(true);
      } else {
        toast.error("Unknown Quiz Type");
      }
    } catch (error) {
      console.error("Error fetching quiz data:", error);
      toast.error("Failed to fetch quiz data. Please try again");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedQuiz(null);
    setQuizType("");
  };

  const handleQuestionAnalysis = (quiz) => {
    if (quiz.type === "Q&A") {
      navigate("/dashboard", {
        state: { page: "qanda-analysis", quizId: quiz._id },
      });
    } else if (quiz.type === "Poll") {
      navigate("/dashboard", {
        state: { page: "poll-analysis", quizId: quiz._id },
      });
    } else {
      toast.error("Unknown quiz type");
    }
  };

  return (
    <div className="analytics-container">
      <div className="analytics-heading-search-container">
<h1 className="analytics-heading">Quiz Analysis</h1>
<input type="text" className="analytics-search-item" placeholder="Search by quiz name or type..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
      </div>
      <FaMagnifyingGlass className="analytics-magnifying"/>

      <table className="analytics-table">
        <thead>
          <tr>
            <th>Sl No.</th>
            <th>Quiz Name</th>
            <th>Quiz Type</th>
            <th>Created On</th>
            <th>Actions</th>
            <th>Question Analysis</th>
          </tr>
        </thead>
        <tbody className="analytics-tbody">
          {filteredQuizzes.length > 0 ? (
            filteredQuizzes.map((quiz, index) => (
              <tr key={quiz._id}>
                <td data-label="Sl No.">{index + 1}</td>
                <td data-label="Quiz Name">
                  <p className="analytics-tbody-data-label-quiz-name">
                    {quiz.name}
                  </p>
                </td>
                <td data-label="Quiz Type">{quiz.type}</td>
                <td data-label="Created On">
                  {" "}
                  {new Date(quiz.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
                <td data-label="Actions">
                  <div className="analytics-actions-icons">
                    <FaEdit
                      className="analytics-icon analytics-edit"
                      title="Edit"
                      onClick={() => handleEditQuiz(quiz)}
                    />
                    <FaTrashAlt
                      className="analytics-icon analytics-trash"
                      title="Delete"
                      onClick={() => handleDeleteClick(quiz._id)}
                    />
                    <FaShareAlt
                      className="analytics-icon analytics-share"
                      title="Share"
                      onClick={() => handleCopyLink(quiz)}
                    />
                  </div>
                </td>
                <td data-label="Question Analysis">
                  <div className="analytics-question-wise">
                    <button
                      onClick={() => handleQuestionAnalysis(quiz)}
                      className="analytics-question-wise-btn"
                    >
                      Question wise analysis
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">{searchTerm ? "No matching quiz found" : "No quizzes found"}</td>
            </tr>
          )}
        </tbody>
      </table>
      {isModalOpen && quizType === "Q&A" && selectedQuiz && (
        <QandA
          closeModel={closeModal}
          quizName={selectedQuiz.name}
          quizId={selectedQuiz._id}
          existingData={selectedQuiz}
        />
      )}

      {isModalOpen && quizType === "Poll" && selectedQuiz && (
        <PollType
          closeModel={closeModal}
          quizName={selectedQuiz.name}
          quizId={selectedQuiz._id}
          existingData={selectedQuiz}
        />
      )}

      {deleteModalOpen && (
        <DeleteQuiz
          onDelete={confirmDelete}
          onCancel={() => {
            setDeleteModalOpen(false);
            setQuizToDelete(null);
          }}
        />
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default Analytics;
