  import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from "yup";
import { RootState } from "../../../Store";
import { setUserInfo } from "../../../Store/Nutrition";
import CustomSelect, { OptionType } from "../../../Components/Shared/CustomSelect/CustomSelect";
import { ROUTES_CONFIG } from "../../../Shared/Constants";
import CustomButton from "../../../Components/Shared/Form/CustomButton/CustomButton";



// Define types for the user form data
interface UserInfoForm {
  userName: string;
  height: number ;
  gender: string;
  age:  number;
}

const UserInfo: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Select data from Redux store with proper types
  const userheight = useSelector((state:RootState ) => state.Nutrition.height);   
  const userage = useSelector((state: RootState) => state.Nutrition.age);
  const usergender = useSelector((state: RootState) => state.Nutrition.gender);
  const username = useSelector((state: RootState) => state.Nutrition.userName);

  // Gender options
  const genderOptions :OptionType[]= [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  // Formik for form handling
  const formik = useFormik<UserInfoForm>({
    initialValues: {
      userName: username || "",
      height: userheight    ,
      gender: usergender || "",
      age: userage ,
    },
    validationSchema: Yup.object({
      userName: Yup.string().required("Name is required."),
      height: Yup.number()
        .typeError("Height must be a number")
        .required("Height is required.")
        .positive("Height must be positive.")
        .integer("Height must be a whole number."),
      gender: Yup.string().required("Gender is required."),
      age: Yup.number()
        .typeError("Age must be a number")
        .required("Age is required.")
        .positive("Age must be positive.")
        .integer("Age must be a whole number."),
    }),
    onSubmit: (values) => {
      dispatch(setUserInfo(values));
      navigate(ROUTES_CONFIG.INPUT_WEIGHT.path);
    },
  });

  return (
    <>
     
      <h3
        style={{
          fontSize: "2.3rem",
          color: "#737373",
          textAlign: "center",
          marginTop: "3%",
        }}
      >
        Welcome to Nutrition Tracker
      </h3>
      <h3 style={{ textAlign: "center", color: "#627373" }}>
        We’re happy you’re here. <br />
        Let’s get to know a little about you.
      </h3>
      <div className="calorie-container">
        <form onSubmit={formik.handleSubmit}>
          <div className="input-group">
            <label>Enter Your Name</label>
            <input
              type="text"
              id="userName"
              {...formik.getFieldProps("userName")}
              placeholder="Enter your Name"
            />
            {formik.touched.userName && formik.errors.userName && (
              <p className="error-message">{formik.errors.userName}</p>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="height">Height (cm)</label>
            <input
              type="number"
              id="height"
              min="25"
              {...formik.getFieldProps("height")}
              value={formik.values.height || ""}
              placeholder="Enter your height"
            />
            {formik.touched.height && formik.errors.height && (
              <p className="error-message">{formik.errors.height}</p>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="gender">Gender:</label>
           <CustomSelect
              options={genderOptions}
              value={genderOptions.find(
                (option) => option.value === formik.values.gender 
              ) || null}
              onChange={(selectedOption) =>
                formik.setFieldValue("gender", selectedOption?.value)
              }
              placeholder="-- Select Gender --"
            />    
            {formik.touched.gender && formik.errors.gender && (
              <p className="error-message">{formik.errors.gender}</p>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="age">Age (years):</label>
            <input
              type="number"
              id="age"
              min="1"
              {...formik.getFieldProps("age")}
              value={formik.values.age || ""}
              placeholder="Enter age in years"

            />
            {formik.touched.age && formik.errors.age && (
              <p className="error-message">{formik.errors.age}</p>
            )}
          </div>

          <CustomButton
            type="submit"
            style={{
           
              marginLeft: "40%",
            }}
            size={"medium"}
            onClick={formik.handleSubmit}
            label={"Next"}
          >
            {/* Next */}
          </CustomButton>
        </form>
      </div>
     
    </>
  );
};

export default UserInfo;
