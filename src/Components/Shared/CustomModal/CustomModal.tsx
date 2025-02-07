import React, { ReactNode, useEffect } from "react";
import "./CustomModal.css"; 

interface CustomModalProps {
  isOpen: boolean; 
  onClose: () => void; 
  title?: string;
  children: ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  
    return () => {
      document.body.classList.remove("modal-open"); 
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
