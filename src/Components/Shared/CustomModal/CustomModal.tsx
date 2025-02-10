import React, { ReactNode, useEffect } from "react";
import "./CustomModal.css"; 

interface CustomModalProps {
  isOpen: boolean; 
  onClose: () => void; 
  title?: string;
  children: ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    } 
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);  

  
  if (!isOpen) return null;

  return (
    <div className="custom-modal-overlay" onClick={onClose}>
      <div  
        className="custom-modal-content"
        onClick={(e) => e.stopPropagation()} 


      >
        {title && <h2 className="custom-modal-title">{title}</h2>}
          {/* <button className="custom-modal-close" onClick={onClose}>
            &times;
          </button> */}
        <div className="custom-modal-body">{children}</div>
      </div>
    </div>
  );
};

export default CustomModal;
