import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, sendEmailVerification, signInWithPopup, User } from "firebase/auth";
import "react-toastify/dist/ReactToastify.css";
import { Formik, useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Signup.css";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { doc, getFirestore, setDoc } from "firebase/firestore";


import { initializeApp } from "firebase/app";
import firebaseConfig from "../../../Utils/firebase";
import { ERROR_MESSAGES, FORM_VALIDATION_MESSAGES, IMAGES, LABEL, SET_DRINKS_CALORIE, SUCCESS_MESSAGES } from "../../../Shared";
import { FIREBASE_DOC_REF, ROUTES_CONFIG } from "../../../Shared/Constants";
import { hideLoader, showLoader } from "../../../Store/Loader";
import { loggedin, setSignup } from "../../../Store/Auth";
import { CustomError } from "../../../Shared/Common";
import CustomButton from "../../../Components/Shared/CustomButton/CustomButton";


interface SignupFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const dispatch = useDispatch();
  const provider = new GoogleAuthProvider(); 

  const formik = useFormik<SignupFormValues>({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },

    validationSchema :Yup.object({
      email: Yup.string()
        .email(ERROR_MESSAGES().INVALID_EMAIL) 
        .matches(/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, ERROR_MESSAGES().INVALID_EMAIL) 
        .required(ERROR_MESSAGES().REQUIRED),
      
      password: Yup.string()
        .min(8, FORM_VALIDATION_MESSAGES().VALID_PASSWORD) 
        .max(20, FORM_VALIDATION_MESSAGES().PASSWORD_TOO_LONG) 
        .matches(/[A-Z]/, FORM_VALIDATION_MESSAGES().PASSWORD_UPPERCASE) 
        .matches(/[a-z]/, FORM_VALIDATION_MESSAGES().PASSWORD_LOWERCASE) 
        .matches(/[0-9]/, FORM_VALIDATION_MESSAGES().PASSWORD_NUMBER) 
        .matches(/[@$!%*?&]/, FORM_VALIDATION_MESSAGES().PASSWORD_SPECIAL) 
        .required(FORM_VALIDATION_MESSAGES().REQUIRED),
        confirmPassword: Yup.string().required(FORM_VALIDATION_MESSAGES().REQUIRED),
    }),
    // validationSchema: Yup.object({
    //   email: Yup.string().email(ERROR_MESSAGES().INVALID_EMAIL).required(ERROR_MESSAGES().REQUIRED),
    //   password: Yup.string().min(8, FORM_VALIDATION_MESSAGES().VALID_PASSWORD).required(FORM_VALIDATION_MESSAGES().REQUIRED),
    //   confirmPassword: Yup.string()
        
    //     .required(FORM_VALIDATION_MESSAGES().REQUIRED),
    // }),
    onSubmit: async (values, { setSubmitting }: FormikHelpers<SignupFormValues>) => {
      dispatch(showLoader());
      const { email, password } = values;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDocRef = doc(db, FIREBASE_DOC_REF.USER, user.uid);
        await setDoc(userDocRef, { calorie: SET_DRINKS_CALORIE.CALORIE, water: SET_DRINKS_CALORIE.WATER, alcohol: SET_DRINKS_CALORIE.ALOCOHOL, caffeine: SET_DRINKS_CALORIE.CAFFEINE });

        toast.success(SUCCESS_MESSAGES().SIGNED_UP_SUCCESSFULLY);
        dispatch(loggedin());
        
        const  currentUser :User | null = auth.currentUser
        sendEmailVerification(currentUser  as User )
        navigate(ROUTES_CONFIG.DASHBOARD.path);
      }  catch (error: CustomError|unknown) {
        const errorCode = (error as CustomError)?.data?.code ; 
        const errorMessage = (error as CustomError)?.message;
        toast.error(SUCCESS_MESSAGES().SIGNED_UP_NOT_SUCCESSFULLY);
        console.error(errorCode, errorMessage);
      } finally {
        dispatch(setSignup());
        dispatch(hideLoader());
        setSubmitting(false);
      }
    },
  });

  const handleGoogleSignup = async () => {
    formik.setValues({ email: "", password: "", confirmPassword: "" });
    dispatch(showLoader());
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, FIREBASE_DOC_REF.USER, user.uid);

      await setDoc(userDocRef, { calorie: SET_DRINKS_CALORIE.CALORIE, water: SET_DRINKS_CALORIE.WATER, alcohol: SET_DRINKS_CALORIE.ALOCOHOL, caffeine: SET_DRINKS_CALORIE.CAFFEINE });

      toast.success(SUCCESS_MESSAGES().GOOGLE_SIGNEDUP_SUCCESS);
    //   dispatch(loggedin());
      navigate(ROUTES_CONFIG.DASHBOARD.path);
    } catch (error: CustomError|unknown) {
      const errorCode = (error as CustomError)?.data?.code ; 
      const errorMessage = (error as CustomError)?.message;
      toast.error(ERROR_MESSAGES().GOOGLE_SIGNEDUP_FAIL)
      console.error(errorCode, errorMessage);
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <>
   
      <div className="signup-container">
        <h2 className="signup-title">{LABEL.SIGN_UP}</h2>
        <form className="signup-form" onSubmit={formik.handleSubmit}>
          <label className="signup-label" htmlFor="email">{LABEL.EMAIL}</label>
          <input
            id="email"
            className="signup-input"
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="error-message">{formik.errors.email}</div>
          ) : null}

          <label className="signup-label" htmlFor="password">{LABEL.PASSWORD}</label>
          <div className="password-wrapper">
            <input
              id="password"
              className="signup-input"
              type={passwordVisible ? "text" : "password"}
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            <span
              className="password-toggle"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {formik.touched.password && formik.errors.password ? (
            <div className="error-message">{formik.errors.password}</div>
          ) : null}

          <label className="signup-label" htmlFor="confirmPassword">{LABEL.CONFIRM_PASS}</label>
          <div className="password-wrapper">
            <input
              id="confirmPassword"
              className="signup-input"
              type={confirmPasswordVisible ? "text" : "password"}
              name="confirmPassword"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
            />
            <span
              className="password-toggle"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div className="error-message">{formik.errors.confirmPassword}</div>
          ) : null}

          <CustomButton className="signup-button" type="submit" label={LABEL.SIGN_UP}></CustomButton>
        </form>
        <p className="login-footer">Or</p>
        <button className="signup-button" onClick={handleGoogleSignup}>
          <img src={IMAGES.googleLogo} alt="Google Logo" className="google-logo" />
          {LABEL.SIGN_IN_GOOGLE}
        </button>

        <p className="signup-footer">
          {LABEL.ALREADY_ACC} <Link className="signup-link" to={ROUTES_CONFIG.LOGIN.path}>{LABEL.LOG_IN}</Link>
        </p>
      </div>
    </>
  );
};

export default Signup;