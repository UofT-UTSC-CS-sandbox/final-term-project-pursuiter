import React from "react";
import "./Modal.css";
// import "./UserInformation.css";

function Modal({ show, onClose, children }) {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">{children}</div>
    </div>
  );
}

export default Modal;
