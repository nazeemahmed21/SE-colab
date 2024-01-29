import React from "react";

const Popup = ({ onClose }) => {
  return (
    <div className="popup">
      <div className="popup-content">
        <span className="close" onClick={onClose}>&times;</span>
        <button className="close-button" onClick={onClose}>Registered successfully! <br></br> Click here to close</button>
      </div>
    </div>
  );
};

export default Popup;
