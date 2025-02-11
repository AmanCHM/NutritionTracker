import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from "yup";
import { RootState } from "../../../Store";
import { setUserInfo } from "../../../Store/Nutrition";
import CustomSelect, {
  OptionType,
} from "../../../Components/Shared/CustomSelect/CustomSelect";
import {
  AGE_VALIDATION,
  GENDER_OPTION,
  HEIGHT_VALIDATION,
  ROUTES_CONFIG,
} from "../../../Shared/Constants";
import CustomButton from "../../../Components/Shared/CustomButton/CustomButton";
import {
  FORM_VALIDATION_MESSAGES,
  GREETINGS,
  LABEL,
  USER,
  VALIDATION_REGEX,
} from "../../../Shared";

// Define types for the user form data
interface UserInfoForm {
  userName: string;
  height: number;
  gender: string;
  age: number;
}

const genderOptions: OptionType[] = [
  { value: GENDER_OPTION.MALE, label: GENDER_OPTION.MALE },
  { value: GENDER_OPTION.FEMALE, label: GENDER_OPTION.FEMALE },
];
const UserInfo: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Select data from Redux store with proper types
  const userheight = useSelector((state: RootState) => state.Nutrition.height);
  const userage = useSelector((state: RootState) => state.Nutrition.age);
  const usergender = useSelector((state: RootState) => state.Nutrition.gender);
  const username = useSelector((state: RootState) => state.Nutrition.userName);

  // Gender options

  // Formik for form handling
  const formik = useFormik<UserInfoForm>({
    initialValues: {
      userName: username || "",
      height: userheight,
      gender: usergender || "",
      age: userage,
    },
    validationSchema: Yup.object({
      userName: Yup.string()
  .matches(VALIDATION_REGEX.USER_NAME, FORM_VALIDATION_MESSAGES().INVALID_NAME) 
  .min(2, FORM_VALIDATION_MESSAGES().NAME_TOO_SHORT) 
  .max(50, FORM_VALIDATION_MESSAGES().NAME_TOO_LONG) 
  .required(FORM_VALIDATION_MESSAGES().REQUIRED),

      height: Yup.number()
        .required(HEIGHT_VALIDATION.REQUIRED)
        .min(50)
        .max(300)
        .typeError(HEIGHT_VALIDATION.NUMBER)
        .positive(HEIGHT_VALIDATION.POSITIVE),
       
      gender: Yup.string().required(FORM_VALIDATION_MESSAGES().GENDER_REQUIRED),
      age: Yup.number()
        .min(0)
        .max(120)
        .required(AGE_VALIDATION.REQUIRED)
        .typeError(AGE_VALIDATION.NUMBER)
        .positive(AGE_VALIDATION.POSITIVE)
        .integer(AGE_VALIDATION.INTEGER),
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
        {GREETINGS.WELCOME_NUTRITRACK}
      </h3>
      <h3 style={{ textAlign: "center", color: "#627373" }}>
        {GREETINGS.HAPPY_GREET} <br />
        {GREETINGS.INFO_GREET}
      </h3>
      <div className="calorie-container">
        <form onSubmit={formik.handleSubmit}>
          <div className="input-group">
            <label>{LABEL.ENTER_NAME}</label>
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
            <label htmlFor="height">{USER.HEIGHT}</label>
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
            <label htmlFor="gender">{USER.GENDER}</label>
            <CustomSelect
              options={genderOptions}
              value={
                genderOptions.find(
                  (option) => option.value === formik.values.gender
                ) || null
              }
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
            <label htmlFor="age">{USER.AGE}</label>
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
          ></CustomButton>
        </form>
      </div>
    </>
  );
};

export default UserInfo;
