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
// import { loggedin } from "../../Redux/logSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";
// import { hideLoader, showLoader } from "../../Redux/loaderSlice";
// import Navbar from "../Page-Components/Navbar";
import googleLogo from "../../assets/images/google.png";
import { auth } from "../../Utils/firebase";

interface RootState {
  loaderReducer: {
    loading: boolean;
  };
}

interface MyFormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const loader = useSelector((state: RootState) => state.loaderReducer.loading);

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    formik.setValues({ email: "", password: "" });
    // dispatch(showLoader());
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // dispatch(loggedin());
      navigate("/dashboard");
      toast.success("Google Logged in successful");
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      toast.error("Google Login failed");
      console.error(errorCode, errorMessage);
    } finally {
      // dispatch(hideLoader());
    }
  };

  // Form validation with Formik and Yup
  const formik = useFormik<MyFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().min(8, "Must be 8 characters").required("Required"),
    }),
    onSubmit: async (values: MyFormValues, { setSubmitting }: FormikHelpers<MyFormValues>) => {
      // dispatch(showLoader());
      const { email, password } = values;

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        toast.success("Logged in Successfully");
        // dispatch(loggedin());
        navigate("/dashboard");
      } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error("Login not successful");
        console.log(errorCode, errorMessage);
      } finally {
        setSubmitting(false);
        // dispatch(hideLoader());
      }
    },
  });

  return (
    <>
      {/* <Navbar /> */}

      <div className="login-page">
        <div className="login-container">
          <h2 className="login-title">Log-in Form</h2>
          <form className="login-form" onSubmit={formik.handleSubmit}>
            <label className="login-label" htmlFor="email">
              Email Address
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
              Password
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

            <button className="login-button" type="submit">
              Submit
            </button>

            <p className="login-footer">Or</p>

            <button className="google-login-button" type="button" onClick={handleGoogleSignIn}>
              <img src={googleLogo} alt="Google logo" className="google-logo" />
              Sign in with Google
            </button>

            <p className="login-footer">
              Forgot password?{" "}
              <Link className="login-link" to="/reset">
                Reset-Password
              </Link>
            </p>
            <p className="login-footer">
              Don't have an account?{" "}
              <Link className="login-link" to="/signup">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;