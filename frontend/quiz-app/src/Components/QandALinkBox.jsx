import React from "react";
import { IoMdClose } from "react-icons/io";
import "../Styles/QandALinkBox.css";
import { ToastContainer, toast } from "react-toastify";

const QandALinkBox = ({ generatedLink, onClose }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    toast.success("Link copied successfully!");
  };
  return (
    <div className="qanda-link-box-modal">
      <div className="qanda-link-box-container">
        <IoMdClose className="qanda-link-box-close" onClick={onClose} />
        <p className="qanda-link-box-congrats">
          Congrats your quiz is published!
        </p>
        <div className="qanda-link-box-input">
          <input
            type="text"
            value={generatedLink}
            readOnly
            className="qanda-link-box-input-box"
          />
        </div>
        <div className="qanda-link-box-share">
          <button
            onClick={copyToClipboard}
            className="qanda-link-box-share-btn"
          >
            Share
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default QandALinkBox;
