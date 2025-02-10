import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../../../Utils/firebase";
import { ROUTES_CONFIG } from "../../../Shared/Constants";
import { ERROR_MESSAGES, LABEL, SUCCESS_MESSAGES, VALIDATION_REGEX } from "../../../Shared";
import { CustomError } from "../../../Shared/Common";
import CustomButton from "../../../Components/Shared/CustomButton/CustomButton";
import { useFormik } from "formik";
import * as Yup from "yup"; // For validation

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();

  // Formik hook with validation schema
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(ERROR_MESSAGES().INVALID_EMAIL)
        .matches(VALIDATION_REGEX.EMAIL, ERROR_MESSAGES().INVALID_EMAIL) 
        .required(ERROR_MESSAGES().REQUIRED),
    }),
    onSubmit: async (values) => {
      try {
        await sendPasswordResetEmail(auth, values.email);
        toast.success(SUCCESS_MESSAGES().EMAIL_SENT);
        navigate(ROUTES_CONFIG.LOGIN.path);
      } catch (error: CustomError | unknown) {
        const errorCode = (error as CustomError)?.data?.code;
        const errorMessage = (error as CustomError)?.message;
        toast.error(ERROR_MESSAGES().EMAIL_NOT_REGISTERED);
        console.error(errorCode, errorMessage);
      }
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit} className="reset-container">
        <div>
          <h2 className="reset-title">{LABEL.RESET_PASS}</h2>
          <label className="reset-label" htmlFor="email">
            {LABEL.EMAIL}
          </label>
          <input
            id="email"
            className="login-input"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {/* Error handling */}
          {formik.touched.email && formik.errors.email && (
            <p className="error-message">{formik.errors.email}</p>
          )}
        </div>
        <CustomButton type="submit" label={LABEL.RESET_PASS}></CustomButton>
        <p className="login-footer" style={{ color: "#303952" }}>
          {LABEL.GO_TO_LOGIN}{" "}
          <Link to={ROUTES_CONFIG.LOGIN.path} className="login-link">
            {LABEL.LOG_IN}
          </Link>
        </p>
      </form>
    </>
  );
};

export default ResetPassword;
