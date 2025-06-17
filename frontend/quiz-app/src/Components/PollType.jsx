import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";
import "../Styles/PollType.css";
import { MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import PollLinkBox from "./PollLinkBox";

const PollType = ({ closeModel, quizId, existingData }) => {
  const [selectedType, setSelectedType] = useState("text");
  const [selectedOptionIndexes, setSelectedOptionIndexes] = useState({});
  const [questions, setQuestions] = useState({
    text: [{ id: 1, question: "", options: ["", "", ""] }],
    image: [{ id: 1, question: "", options: ["", "", ""] }],
    "text-image": [
      {
        id: 1,
        question: "",
        options: [
          { text: "", image: "" },
          { text: "", image: "" },
          { text: "", image: "" },
        ],
      },
    ],
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizLink, setQuizLink] = useState("");
  const [showLinkModal, setShowLinkModal] = useState(false);

  useEffect(() => {
    if (existingData) {
      console.log("PollType received existingData:", existingData);
      setSelectedType(existingData.optionType || "text");
      const restoredQuestions = { text: [], image: [], "text-image": [] };

      restoredQuestions[existingData.optionType] = existingData.questions.map(
        (q, index) => ({
          id: index + 1,
          question: q.question,
          options: q.options.map((opt) => {
            if (existingData.optionType === "text") return opt.text;
            if (existingData.optionType === "image") return opt.image;
            if (existingData.optionType === "text-image")
              return { text: opt.text, image: opt.image };
            return "";
          }),
        })
      );

      setQuestions(restoredQuestions);

      const selectedIndexes = {};
      existingData.questions.forEach((q, i) => {
        if (q.correctAnswer !== undefined && q.correctAnswer !== null) {
          selectedIndexes[i] = q.correctAnswer;
        }
      });
      setSelectedOptionIndexes(selectedIndexes);
    }
  }, [existingData]);

  const addQuestion = () => {
    if (questions[selectedType].length < 5) {
      setQuestions({
        ...questions,
        [selectedType]: [
          ...questions[selectedType],
          {
            id: questions[selectedType].length + 1,
            question: "",
            options:
              selectedType === "text-image"
                ? [
                    { text: "", image: "" },
                    { text: "", image: "" },
                    { text: "", image: "" },
                  ]
                : ["", "", ""],
          },
        ],
      });
      setCurrentQuestion(questions[selectedType].length);
    }
  };

  const updateQuestion = (value) => {
    const updatedQuestions = [...questions[selectedType]];
    updatedQuestions[currentQuestion] = {
      ...updatedQuestions[currentQuestion],
      question: value,
    };
    setQuestions({ ...questions, [selectedType]: updatedQuestions });
  };

  const updateOption = (index, value, field) => {
    const updatedQuestions = [...questions[selectedType]];
    if (selectedType === "text-image") {
      updatedQuestions[currentQuestion].options[index] = {
        ...updatedQuestions[currentQuestion].options[index],
        [field]: value,
      };
    } else if (selectedType === "image") {
      updatedQuestions[currentQuestion].options[index] = value;
    } else {
      updatedQuestions[currentQuestion].options[index] = value;
    }
    setQuestions({ ...questions, [selectedType]: updatedQuestions });
  };

  const changeOptionType = (type) => {
    if (existingData && type !== existingData.optionType) {
      toast.warning("You cannot change the option type");
      return;
    }
    setSelectedType(type);
    setCurrentQuestion(0);
  };

  const addOption = () => {
    const updatedQuestions = [...questions[selectedType]];
    if (updatedQuestions[currentQuestion].options.length < 6) {
      updatedQuestions[currentQuestion] = {
        ...updatedQuestions[currentQuestion],
        options: [
          ...updatedQuestions[currentQuestion].options,
          selectedType === "text-image" ? { text: "", image: "" } : "",
        ],
      };
      setQuestions({ ...questions, [selectedType]: updatedQuestions });
    }
  };

  const removeOption = (index) => {
    const updatedQuestions = [...questions[selectedType]];
    updatedQuestions[currentQuestion] = {
      ...updatedQuestions[currentQuestion],
      options: updatedQuestions[currentQuestion].options.filter(
        (_, i) => i !== index
      ),
    };
    setQuestions({ ...questions, [selectedType]: updatedQuestions });
  };

  const saveQuiz = async () => {
    try {
      const formattedQuestions = questions[selectedType].map((q) => ({
        question: q.question,
        options: q.options
          .filter((option) => {
            if (selectedType === "text") {
              return option.trim() !== "";
            } else if (selectedType === "image") {
              return option.trim() !== "";
            } else {
              return option.text.trim() !== "" || option.image.trim() !== "";
            }
          })
          .map((option) => {
            if (selectedType === "text") {
              return { text: option };
            } else if (selectedType === "image") {
              return { image: option };
            } else {
              return {
                text: option.text || "",
                image: option.image || "",
              };
            }
          }),
      }));

      const randomLink = uuidv4();
      const fullLink =
        existingData?.link ||

        // `http://localhost:5173/poll-quiz-interface/${randomLink}`;

       `https://quiz-app-frontend-24o8.onrender.com/poll-quiz-interface/${randomLink}`;

        // `${window.location.origin}/poll-quiz-interface/${randomLink}`
      setQuizLink(fullLink);

      const payload = {
        questions: formattedQuestions,
        optionType: selectedType,
        quizLink: randomLink,
        quizId: quizId,
      };
      if (existingData) {
        console.log("Updating quiz with ID", existingData._id);
        await axios.put(
          `https://quiz-app-backend-m5sm.onrender.com/api/pollQuiz/edit/${existingData._id}`,
          payload
        );
        toast.success("Poll Quiz updated successfully");
      } else {
        const res = await axios.post(
          "https://quiz-app-backend-m5sm.onrender.com/api/pollQuiz/create",
          payload
        );
        toast.success("Poll Quiz saved successfully");
        console.log(res.data);
        setShowLinkModal(true);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save quiz");
    }
  };

  return (
    <div className="poll-quiz-modal">
      <div className="poll-quiz-container">
        <div className="poll-question-limit-container">
          <div className="poll-number-plus">
            {questions[selectedType].map((q, index) => (
              <div key={q.id} className="poll-number-plus-btn">
                <button
                  className={`poll-question-number ${
                    index === currentQuestion ? "active" : ""
                  }`}
                  onClick={() => setCurrentQuestion(index)}
                >
                  {q.id}
                </button>
                {index !== 0 && (
                  <RxCross2
                    className="poll-rxcross-icon"
                    onClick={() => {
                      const updated = [...questions[selectedType]];
                      updated.splice(index, 1);
                      setQuestions({ ...questions, [selectedType]: updated });
                      if (currentQuestion >= index && currentQuestion !== 0) {
                        setCurrentQuestion((prev) => prev - 1);
                      }
                    }}
                  />
                )}
              </div>
            ))}
            {questions[selectedType].length < 5 && (
              <FaPlus onClick={addQuestion} style={{ cursor: "pointer" }} />
            )}
          </div>
          <div className="poll-max-question-text">
            <p className="poll-max-question">Max 5 questions</p>
          </div>
        </div>
        <div className="poll-input-box-container">
          <input
            type="text"
            placeholder="Poll Question"
            className="poll-input-box"
            value={questions[selectedType][currentQuestion].question}
            onChange={(e) => updateQuestion(e.target.value)}
          />
        </div>
        <div className="poll-option-type-container">
          <p>Option type</p>
          <div className="poll-option-items">
            {["text", "image", "text-image"].map((type) => (
              <label key={type}>
                <input
                  type="radio"
                  name="option"
                  value={type}
                  checked={selectedType === type}
                  onChange={(e) => changeOptionType(e.target.value)}
                />
                {type === "text"
                  ? "Text"
                  : type === "image"
                  ? "Image URL"
                  : "Text-Image URL"}
              </label>
            ))}
          </div>
        </div>
        <div className="poll-option-select-container">
          {questions[selectedType][currentQuestion].options.map(
            (option, index) => (
              <div key={index} className="poll-option-select-item">
                {selectedType === "text-image" ? (
                  <>
                    <input
                      type="text"
                      placeholder="Enter Text"
                      className="poll-option-select-item-textbox"
                      value={option.text}
                      onChange={(e) =>
                        updateOption(index, e.target.value, "text")
                      }
                    />
                    <input
                      type="text"
                      placeholder="Enter Image URL"
                      className="poll-option-select-item-textbox"
                      value={option.image}
                      onChange={(e) =>
                        updateOption(index, e.target.value, "image")
                      }
                    />
                  </>
                ) : (
                  <input
                    type="text"
                    className="poll-option-select-item-textbox"
                    placeholder={
                      selectedType === "image"
                        ? "Enter Image URL"
                        : "Enter Text"
                    }
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                  />
                )}
                {index >= 2 && (
                  <MdDelete
                    className="poll-delete-icon"
                    onClick={() => removeOption(index)}
                  />
                )}
              </div>
            )
          )}
          {questions[selectedType][currentQuestion].options.length < 6 && (
            <button className="poll-option-select-btn" onClick={addOption}>
              Add Option
            </button>
          )}
        </div>
        <div className="poll-cancel-continue-container">
          <button className="poll-cancel-btn" onClick={closeModel}>
            Cancel
          </button>
          <button className="poll-continue-btn" onClick={saveQuiz}>
            Save Quiz
          </button>
        </div>
      </div>
      {showLinkModal && (
        <div className="poll-linkbox-modal-animation">
          <PollLinkBox
            link={quizLink}
            onClose={() => setShowLinkModal(false)}
          />
        </div>
      )}
    </div>
  );
};

export default PollType;
