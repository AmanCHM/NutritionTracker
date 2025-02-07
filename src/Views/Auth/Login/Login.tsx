import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { toast } from "react-toastify";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";

import { auth } from "../../../Utils/firebase";
import { ERROR_MESSAGES, FORM_VALIDATION_MESSAGES, IMAGES, LABEL, SUCCESS_MESSAGES } from "../../../Shared";
import { RootState } from "../../../Store";
import { ROUTES_CONFIG } from "../../../Shared/Constants";
import { hideLoader, showLoader } from "../../../Store/Loader";
import { loggedin } from "../../../Store/Auth";
import { CustomError } from "../../../Shared/Common";
import CustomButton from "../../../Components/Shared/CustomButton/CustomButton";


interface MyFormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const loader = useSelector((state: RootState) => state.Loader.loading);

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    formik.setValues({ email: "", password: "" });
    dispatch(showLoader());
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      dispatch(loggedin());
      navigate(ROUTES_CONFIG.DASHBOARD.path);
      toast.success(SUCCESS_MESSAGES().GOOGLE_LOGIN_SUCCESS);
    } catch (error: CustomError|unknown) {
      const errorCode = (error as CustomError)?.data?.code ; 
      const errorMessage = (error as CustomError)?.message;
      toast.error(ERROR_MESSAGES().GOOGLE_LOGIN_FAILED);
      console.error(errorCode, errorMessage);
    } finally {
      dispatch(hideLoader());
    }
  };

  // Form validation with Formik and Yup
  const formik = useFormik<MyFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email(ERROR_MESSAGES().INVALID_EMAIL).required(ERROR_MESSAGES().REQUIRED),
      password: Yup.string().min(8, FORM_VALIDATION_MESSAGES().VALID_PASSWORD).required(FORM_VALIDATION_MESSAGES().REQUIRED),
    }),
    onSubmit: async (values: MyFormValues, { setSubmitting }: FormikHelpers<MyFormValues>) => {
      dispatch(showLoader());
      const { email, password } = values;

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        toast.success(SUCCESS_MESSAGES().LOGGED_IN_SUCCESSFULLY);
        dispatch(loggedin());
        navigate(ROUTES_CONFIG.DASHBOARD.path);
      } catch (error: CustomError|unknown) {
        const errorCode = (error as CustomError)?.data?.code ; 
        const errorMessage = (error as CustomError)?.message;
        toast.error(SUCCESS_MESSAGES().LOGGED_IN_UNSUCCESS);
        console.log(errorCode, errorMessage);
      } finally {
        setSubmitting(false);
        dispatch(hideLoader());
      }
    },
  });

  return (
    <>
      

      <div className="login-page">
        <div className="login-container">
          <h2 className="login-title">{LABEL.LOG_IN}</h2>
          <form className="login-form" onSubmit={formik.handleSubmit}>
            <label className="login-label" htmlFor="email">
            {LABEL.EMAIL}
            </label>
            <input
              id="email"
              className="login-input"
              name="email"
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="error-message">{formik.errors.email}</div>
            ) : null}

            <label className="login-label" htmlFor="password">
             {LABEL.PASSWORD}
            </label>
            <div className="password-wrapper">
              <input
                id="password"
                className="login-input"
                type={passwordVisible ? "text" : "password"}
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              <span
                className="login-password-toggle"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {formik.touched.password && formik.errors.password ? (
              <div className="error-message">{formik.errors.password}</div>
            ) : null}

            <CustomButton className="login-button" type="submit" label= {LABEL.SUBMIT}>
           
            </CustomButton>

            <p className="login-footer">{LABEL.OR}</p>

            <button className="google-login-button" type="button" onClick={handleGoogleSignIn}>
              <img src={IMAGES.googleLogo} alt="Google logo" className="google-logo" />
            {LABEL.SIGN_IN_GOOGLE}
            </button>

            <p className="login-footer">
              {LABEL.FORGOT_PASS }
              <Link className="login-link" to={ROUTES_CONFIG.RESET_PASSWORD.path}>
                {LABEL.RESET_PASS}
              </Link>
            </p>
            <p className="login-footer">
             {LABEL.DONT_HAVE_ACC}
              <Link className="login-link" to={ROUTES_CONFIG.REGISTER.path}>
               {LABEL.SIGN_UP}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;