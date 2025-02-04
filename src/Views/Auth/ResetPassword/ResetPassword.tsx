import React, { useState, FormEvent, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";

import { toast } from "react-toastify";
import { auth } from "../../../Utils/firebase";
import { ROUTES_CONFIG } from "../../../Shared/Constants";
import { ERROR_MESSAGES, LABEL, SUCCESS_MESSAGES } from "../../../Shared";

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState<string>(""); 
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success(SUCCESS_MESSAGES().EMAIL_SENT);
      navigate(ROUTES_CONFIG.LOGIN.path);
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      toast.error(ERROR_MESSAGES().EMAIL_NOT_REGISTERED);
      console.error(errorCode, errorMessage);
    }
  };

  
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <>
      {/* <Navbar /> */}
      <form onSubmit={handleSubmit} className="login-container">
        <div>
          <h2 className="login-title">Reset Password Form</h2>
          <label className="login-label" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            className="login-input"
            name="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <button type="submit">{LABEL.RESET_PASS}</button>
        <p className="login-footer" style={{ color: "#303952" }}>
          {LABEL.GO_TO_LOGIN}
          <Link to={ROUTES_CONFIG.LOGIN.path} className="login-link">
            {LABEL.LOG_IN}
          </Link>
        </p>
      </form>
    </>
  );
};

export default ResetPassword;
