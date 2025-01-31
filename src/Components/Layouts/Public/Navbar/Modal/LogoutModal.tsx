import React from "react";
// import "./LogoutModal.css";

interface LogoutModalProps {
  onClose: () => void;  
  onConfirm: () => void; 
}

const LogoutModal: React.FC<LogoutModalProps> = ({ onClose, onConfirm }) => {
  return (
    <div>
      <div className="logout-modal-content">
        <h2>Are you sure ! you want to logout?</h2>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="confirm-button" style={{ marginLeft: "20%" }}>
            Yes, Logout
          </button>
          <button onClick={onClose} className="cancel-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
