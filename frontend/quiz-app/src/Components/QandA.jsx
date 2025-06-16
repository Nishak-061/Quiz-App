import React, { useState } from "react";
import "../Styles/QandA.css";
import { MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import QandALinkBox from "./QandALinkBox";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";
import { toast } from "react-toastify";

const QandA = ({ closeModel, quizName, quizId, existingData }) => {
  const [selectedType, setSelectedType] = useState("text");
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
  const [selectedOptionIndexes, setSelectedOptionIndexes] = useState({});

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");

  useEffect(() => {
    if (existingData) {
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
          timer: q.timer,
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

  const handleSubmit = async () => {
    try {
      const finalQuestions = questions[selectedType].map((q, idx) => ({
        question: q.question,
        options: q.options
          .filter(
            (opt) => opt && (typeof opt === "string" ? opt.trim() !== "" : true)
          )
          .map((opt) => {
            if (selectedType === "text") {
              return { text: opt };
            } else if (selectedType === "image") {
              return { image: opt };
            } else if (selectedType === "text-image") {
              return opt;
            }
          }),

        timer: q.timer || 0,
        correctAnswer:
          selectedOptionIndexes[idx] !== undefined
            ? selectedOptionIndexes[idx]
            : null,
      }));

      const randomId = uuidv4();
      const link =
        existingData?.link ||
        // `http://localhost:5173/qanda-quiz-interface/${randomId}`;
        `${import.meta.env.VITE_FRONTEND_URL || 'https://quiz-app-tvyn.onrender.com'}/qanda-quiz-interface/${randomId}`
      setGeneratedLink(link);

      const payload = {
        questions: finalQuestions,
        optionType: selectedType,
        createdAt: new Date(),
        link: link,
        quizId: quizId,
      };

      if (existingData) {
        console.log("Updating quiz with ID:", existingData._id);
        await axios.put(
          `https://quiz-app-backend-s3ov.onrender.com/api/qanda/edit/${existingData._id}`,
          payload
        );

        toast.success("Q&A Quiz updated successfully");
      } else {
        const response = await axios.post(
          "https://quiz-app-backend-s3ov.onrender.com/api/qanda/create",
          payload
        );

        toast.success("Q&A Quiz created successfully");
        console.log("Quiz saved:", response.data);

        setIsLinkModalOpen(true);
      }
    } catch (error) {
      console.error("Failed to save quiz:", error);
    }
  };

  const updateTimerForCurrentQuestion = (value) => {
    const updatedQuestions = [...questions[selectedType]];
    updatedQuestions[currentQuestion] = {
      ...updatedQuestions[currentQuestion],
      timer: value,
    };
    setQuestions({ ...questions, [selectedType]: updatedQuestions });
  };

  return (
    <div className="QA-quiz-modal">
      <div className="QA-quiz-container">
        <div className="QA-question-limit-container">
          <div className="QA-number-plus">
            {questions[selectedType].map((q, index) => (
              <div key={q.id} className="QA-number-plus-btn">
                <button
                  key={q.id}
                  className={`QA-question-number ${
                    index === currentQuestion ? "active" : ""
                  }`}
                  onClick={() => setCurrentQuestion(index)}
                >
                  {q.id}
                </button>
                {index !== 0 && (
                  <RxCross2
                    className="QA-rxcross-icon"
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
              <FaPlus onClick={addQuestion} className="QA-plus-icon" />
            )}
          </div>
          <div className="QA-max-question-text">
            <p className="QA-max-question">Max 5 questions</p>
          </div>
        </div>
        <div className="QA-input-box-container">
          <input
            type="text"
            placeholder="Enter Question"
            className="QA-input-box"
            value={questions[selectedType][currentQuestion].question}
            onChange={(e) => updateQuestion(e.target.value)}
          />
        </div>
        <div className="QA-option-type-container">
          <p>Option type</p>
          <div className="QA-option-items">
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
        <div className="QA-option-select-container">
          {questions[selectedType][currentQuestion].options.map(
            (option, index) => (
              <div key={index} className="QA-option-select-item">
                <input
                  type="radio"
                  name="selector"
                  checked={selectedOptionIndexes[currentQuestion] === index}
                  onChange={() =>
                    setSelectedOptionIndexes({
                      ...selectedOptionIndexes,
                      [currentQuestion]: index,
                    })
                  }
                />
                {selectedType === "text-image" ? (
                  <>
                    <input
                      type="text"
                      placeholder="Enter Text"
                      value={option.text}
                      onChange={(e) =>
                        updateOption(index, e.target.value, "text")
                      }
                      onFocus={() =>
                        setSelectedOptionIndexes({
                          ...selectedOptionIndexes,
                          [currentQuestion]: index,
                        })
                      }
                      className={`QA-option-input ${
                        selectedOptionIndexes[currentQuestion] === index
                          ? "correct-option"
                          : ""
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="Enter Image URL"
                      value={option.image}
                      onChange={(e) =>
                        updateOption(index, e.target.value, "image")
                      }
                      onFocus={() =>
                        setSelectedOptionIndexes({
                          ...selectedOptionIndexes,
                          [currentQuestion]: index,
                        })
                      }
                      className={`QA-option-input ${
                        selectedOptionIndexes[currentQuestion] === index
                          ? "correct-option"
                          : ""
                      }`}
                    />
                  </>
                ) : (
                  <input
                    type="text"
                    placeholder={
                      selectedType === "image"
                        ? "Enter Image URL"
                        : "Enter Text"
                    }
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    onFocus={() =>
                      setSelectedOptionIndexes({
                        ...selectedOptionIndexes,
                        [currentQuestion]: index,
                      })
                    }
                    className={`QA-option-input ${
                      selectedOptionIndexes[currentQuestion] === index
                        ? "correct-option"
                        : ""
                    }`}
                  />
                )}
                {index >= 2 && (
                  <MdDelete
                    className="qanda-delete-icon"
                    onClick={() => removeOption(index)}
                  />
                )}
              </div>
            )
          )}
          {questions[selectedType][currentQuestion].options.length < 6 && (
            <button className="QA-option-select-btn" onClick={addOption}>
              Add Option
            </button>
          )}
        </div>
        <div className="QA-timer-selector">
          <p className="QA-timer-selector-text">Timer</p>
          <button
            onClick={() => updateTimerForCurrentQuestion(0)}
            className={`QA-timer-selector-btn ${
              questions[selectedType][currentQuestion]?.timer === 0
                ? "active-timer"
                : ""
            }`}
          >
            OFF
          </button>
          <button
            onClick={() => updateTimerForCurrentQuestion(5)}
            className={`QA-timer-selector-btn ${
              questions[selectedType][currentQuestion]?.timer === 5
                ? "active-timer"
                : ""
            }`}
          >
            5 Sec
          </button>
          <button
            onClick={() => updateTimerForCurrentQuestion(10)}
            className={`QA-timer-selector-btn ${
              questions[selectedType][currentQuestion]?.timer === 10
                ? "active-timer"
                : ""
            }`}
          >
            10 Sec
          </button>
        </div>
        <div className="QA-cancel-continue-container">
          <button className="QA-cancel-btn" onClick={closeModel}>
            Cancel
          </button>
          <button className="QA-continue-btn" onClick={handleSubmit}>
            Save Quiz
          </button>
        </div>
      </div>
      {isLinkModalOpen && (
        <div className="qanda-linkbox-modal-animation">
          <QandALinkBox
            onClose={() => setIsLinkModalOpen(false)}
            generatedLink={generatedLink}
          />
        </div>
      )}
    </div>
  );
};

export default QandA;
