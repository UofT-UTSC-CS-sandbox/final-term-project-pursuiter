import React, { useEffect } from "react";
import "./Modal.css";

function Modal({ show, onClose, children }) {
  useEffect(() => {
    if (show) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [show]);

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
