import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoBookSharp } from "react-icons/io5";
import "../Styles/Dashboard.css";
import CreateQuiz from "./CreateQuiz";
import Analytics from "./Analytics";
import QandAQuestionAnalysis from "./QandAQuestionAnalysis";
import PollQuestionAnalysis from "./PollQuestionAnalysis";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  plugins,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const location = useLocation();
  const [isCreateQuizOpen, setIsCreateQuizOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    location.state?.page || "dashboard"
  );
  const [quizId, setQuizId] = useState(location.state?.quizId || null);
  const [quizCounts, setQuizCounts] = useState({
    total: 0,
    qandaCount: 0,
    pollCount: 0,
    totalThisMonth: 0,
    qandaThisMonth: 0,
    pollThisMonth: 0,
  });
  const [userName, setUserName] = useState("");
  const [latestQuizzes, setLatestQuizzes] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.name) {
      setUserName(storedUser.name);
    }
  }, []);

  useEffect(() => {
    if (location.state?.page) {
      setCurrentPage(location.state.page);
    }
    if (location.state?.quizId) {
      setQuizId(location.state.quizId);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchQuizCounts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/quizzes/quiz-counts"
        );
        setQuizCounts(res.data);
      } catch (error) {
        console.log("Failed to fetch quiz counts:", error);
      }
    };
    fetchQuizCounts();
  }, []);

  useEffect(() => {
    const fetchLatestQuizzes = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/quizzes/all-quizzes"
        );
        const sortedQuizzes = res.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setLatestQuizzes(sortedQuizzes);
      } catch (error) {
        console.log("Failed to fetch latest quizzes:", error);
      }
    };
    fetchLatestQuizzes();
  }, []);

  const renderMainContent = () => {
    if (currentPage === "dashboard") {
      return <h1 className="dashboard-current-username">Welcome {userName}</h1>;
    } else if (currentPage === "analytics") {
      return <Analytics />;
    } else if (currentPage === "qanda-analysis") {
      return <QandAQuestionAnalysis quizId={quizId} />;
    } else if (currentPage === "poll-analysis") {
      return <PollQuestionAnalysis quizId={quizId} />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    console.log("User logged out");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar-container">
        <div className="dashboard-heading-container">
          <IoBookSharp className="dashboard-heading-icon" />
          <h1 className="dashboard-heading">QUIZZIE</h1>
        </div>

        <div className="dashboard-sidebar-items">
          <button
            className="dashboard-sidebar-btn"
            onClick={() => setCurrentPage("dashboard")}
          >
            Dashboard
          </button>
          <button
            className="dashboard-sidebar-btn"
            onClick={() => setCurrentPage("analytics")}
          >
            Analytics
          </button>
          <button
            className="dashboard-sidebar-btn"
            onClick={() => setIsCreateQuizOpen(true)}
          >
            Create Quiz
          </button>
        </div>
        <div className="dashboard-sidebar-logout">
          <button
            onClick={handleLogout}
            className="dashboard-sidebar-logout-btn"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-main-content">
        {renderMainContent()}

        {currentPage === "dashboard" && (
          <div className="dashboard-current-container">
            <div className="dashboard-current-month-container">
              <div className="current-dashboard-quiz">
                <div className="current-dashboard-total-quiz">
                  <span className="current-dashboard-total-quiz-text">
                    {quizCounts.total}
                  </span>
                  <span className="current-dashboard-total-text">
                    Total Quiz
                  </span>
                </div>

                <div className="current-dashboard-total-qanda">
                  <span className="current-dashboard-total-qanda-text">
                    {quizCounts.qandaCount}{" "}
                  </span>
                  <span className="current-dashboard-qanda-text">
                    Total Q&A{" "}
                  </span>
                </div>

                <div className="current-dashboard-total-poll">
                  <span className="current-dashboard-total-poll-text">
                    {" "}
                    {quizCounts.pollCount}
                  </span>
                  <span className="current-dashboard-poll-text">
                    Total poll
                  </span>
                </div>
              </div>

              {/*MONTH PERCENTAGE SHOWING*/}
              <div className="dashboard-month-container">
                <div className="dashboard-month-percentage">
                  <p className="dashboard-month-name">
                    Quiz created in{" "}
                    {new Date().toLocaleDateString("default", {
                      month: "long",
                    })}
                  </p>
                  <div className="dashboard-month-percentage-bar">
                    <progress
                      className="dashboard-percentage-bar"
                      value={quizCounts.totalThisMonth}
                      max={quizCounts.total}
                    ></progress>
                    <span className="dashboard-month-percentage-text">
                      {quizCounts.total > 0
                        ? Math.round(
                            (quizCounts.totalThisMonth / quizCounts.total) * 100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
                <div className="dashboard-month-total-created-container">
                  <div className="dashboard-total-month-quiz">
                    <span className="dashboard-total-month-number">
                      {quizCounts.totalThisMonth}
                    </span>
                    <span>Quiz Created</span>
                  </div>

                  <div className="dashboard-total-month-qanda">
                    <span className="dashboard-total-month-qanda-number">
                      {quizCounts.qandaThisMonth}
                    </span>
                    <span>Q&A Created</span>
                  </div>

                  <div className="dashboard-total-month-poll">
                    <span className="dashboard-total-month-poll-number">
                      {quizCounts.pollThisMonth}
                    </span>
                    <span>Poll Created </span>
                  </div>
                </div>
              </div>
            </div>

            {/* PIE CHARTS */}
            <div className="dashboard-pie-chart-latest-quiz-container">
              <div className="dashboard-top-latest-quiz-container">
                <p className="dashboard-latest-quiz-heading">Top latest quiz</p>
                <div className="dahboard-top-latest-quiz-items">
                  {latestQuizzes.map((quiz, index) => (
                    <div
                      key={quiz._id}
                      className="dashboard-top-latest-quiz-name-type"
                    >
                      <div className="dashboard-latest-quiz-items">
                        <div className="dashboard-name-type-month">
                          <p className="dashboard-name-type-month-ellipsis">
                            {quiz.name}
                          </p>
                          <p>{quiz.type}</p>
                          <p>
                            {new Date(quiz.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {quizCounts.total > 0 && (
                <div className="dashboard-pie-chart-container">
                  <Pie
                    data={{
                      labels: ["Total Quizzes", "Poll Quizzes", "Q&A Quizzes"],
                      datasets: [
                        {
                          data: [
                            quizCounts.total,
                            quizCounts.pollCount,
                            quizCounts.qandaCount,
                          ],
                          backgroundColor: ["green", "peachpuff", "lavender"],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: {
                            font: {
                              family: "Poppins",
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {isCreateQuizOpen && (
        <CreateQuiz closeModel={() => setIsCreateQuizOpen(false)} />
      )}
    </div>
  );
};

export default Dashboard;
