import React, { useState, FormEvent, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";

import { toast } from "react-toastify";
import { auth } from "../../../Utils/firebase";

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState<string>(""); // Type the state explicitly as a string
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Email sent");
      navigate("/login");
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      toast.error("Email not registered");
      console.error(errorCode, errorMessage);
    }
  };

  // Function to handle email input change
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
        <button type="submit">Reset-Password</button>
        <p className="login-footer" style={{ color: "#303952" }}>
          Go to login page{" "}
          <Link to="/login" className="login-link">
            Log-in
          </Link>
        </p>
      </form>
    </>
  );
};

export default ResetPassword;
