import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./EmailVerificationModal.css"; 
import { ROUTES_CONFIG } from "../../../../../Shared/Constants";
import { auth } from "../../../../../Utils/firebase";
import { sendEmailVerification } from "firebase/auth";
import CustomModal from "../../../../../Components/Shared/CustomModal/CustomModal";
import { ERROR_MESSAGES, LABEL, SUCCESS_MESSAGES } from "../../../../../Shared";



const EmailVerificationModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await currentUser.reload(); 
        if (currentUser.emailVerified) {
          setIsEmailVerified(true);
          clearInterval(interval);
          toast.success(SUCCESS_MESSAGES().EMAIL_VERIFIED);
          setTimeout(() => {
            onClose();
            navigate(ROUTES_CONFIG.DASHBOARD.path);
          }, 2000);
        }
      }
      setIsChecking(false);
    }, 5000); 

    return () => clearInterval(interval);
  }, [navigate, onClose]);

  const handleResendVerification = async () => {
    const currentUser = auth.currentUser;
    if (currentUser && !currentUser.emailVerified) {
      try {
        await sendEmailVerification(currentUser);
        toast.success(SUCCESS_MESSAGES().EMAIL_RESEND);
      } catch (error) {
        toast.error(ERROR_MESSAGES().VERIFICATION_FAILED);
      }
    }
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <div className="modal-container">
        <h2 className="modal-title">{LABEL.EMAIL_VERIFIY_REQUIRED}</h2>
        <p className="modal-text">
        {LABEL.VERIFICATION_MAIL_SENT}
        </p>

        {!isChecking ? (
          !isEmailVerified ? (
            <>
              <p className="modal-info">{LABEL.RESEND_MSG}</p>
              <button onClick={handleResendVerification} className="resend-btn">
                {LABEL.RESEND_MAIL}
              </button>
            </>
          ) : (
            <p className="success-text">{LABEL.EMAIL_VERIFIED}</p>
          )
        ) : (
          <p className="loading-text">{LABEL.CHECK_VERIFICATION}</p>
        )}
      </div>
    </CustomModal>
  );
};

export default EmailVerificationModal;
