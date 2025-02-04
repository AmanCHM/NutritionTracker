import React from "react";
import { LABEL } from "../../../../../Shared";
// import "./LogoutModal.css";

interface LogoutModalProps {
  onClose: () => void;  
  onConfirm: () => void; 
}

const LogoutModal: React.FC<LogoutModalProps> = ({ onClose, onConfirm }) => {
  return (
    <div>
      <div className="logout-modal-content">
        <h2>{LABEL.LOGOUT_WARNING}</h2>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="confirm-button" style={{ marginLeft: "20%" }}>
        {LABEL.LOGOUT_OPTION}
          </button>
          <button onClick={onClose} className="cancel-button">
            {LABEL.LOGOUT_CANCEL}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
