import React from "react";
import { LABEL } from "../../../../../Shared";
import CustomButton from "../../../../Shared/CustomButton/CustomButton";
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
          <CustomButton onClick={onConfirm} className="confirm-button" style={{ marginLeft: "20%" }} label={LABEL.LOGOUT_OPTION}>
        
          </CustomButton>
          <CustomButton onClick={onClose} className="cancel-button" label= {LABEL.LOGOUT_CANCEL}>
           
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
