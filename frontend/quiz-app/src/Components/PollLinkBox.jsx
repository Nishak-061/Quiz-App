import React from "react";
import { IoMdClose } from "react-icons/io";
import "../Styles/PollLinkBox.css";
import { toast, ToastContainer } from "react-toastify";

const PollLinkBox = ({ link, onClose }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    toast.success("Link copied successfully!");
  };
  return (
    <div className="poll-link-box-modal">
      <div className="poll-link-box-container">
        <IoMdClose className="poll-link-box-close" onClick={onClose} />
        <p className="poll-link-box-congrats">
          Congrats your quiz is published!
        </p>
        <div className="poll-link-box-input">
          <input
            type="text"
            value={link}
            readOnly
            className="poll-link-box-input-box"
          />
        </div>
        <div className="poll-link-box-share">
          <button onClick={copyToClipboard} className="poll-link-box-share-btn">
            Share
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default PollLinkBox;
