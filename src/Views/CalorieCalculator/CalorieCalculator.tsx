import React, { useState } from "react";


import { useFormik, FieldProps } from "formik";
import * as Yup from "yup";
import "./CalorieCalculator.css";
import { toast } from "react-toastify";

import { useDispatch } from "react-redux";
import { auth, db } from "../../Utils/firebase";
import { doc, setDoc } from "firebase/firestore";
import { setSignout } from "../../Store/Auth";
import CustomSelect, { OptionType } from "../../Components/Shared/CustomSelect/CustomSelect";
import { ACTIVITY_OPTIONS, AGE_VALIDATION, FIREBASE_DOC_REF, HEIGHT_VALIDATION, WEIGHT_VALIDATION } from "../../Shared/Constants";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../Shared";

interface ActivityOption {
  value: number;
  label: string;
}

interface FormValues {
  height: string;
  weight: string;
  age: string;
  gender: string;
  activityLevel: ActivityOption;
}

const activityOptions = [
 ACTIVITY_OPTIONS.SEDENTARY,
ACTIVITY_OPTIONS.LIGHTLY_ACTIVE,
ACTIVITY_OPTIONS.MODERATELY_ACTIVE,
ACTIVITY_OPTIONS.VERY_ACTIVE,
ACTIVITY_OPTIONS.EXTRA_ACTIVE

];

const CalorieCalculator: React.FC = () => {
  const [calculatedCalorie, setCalculatedCalorie] = useState<number | null>(null);
  const currentUser = auth.currentUser;
  const dispatch = useDispatch();
  
  const formik = useFormik<FormValues>({
    initialValues: {
      height: "",
      weight: "",
      age: "",
      gender: "male",
      activityLevel: activityOptions[0],
    
    },

    validationSchema: Yup.object({
      height: Yup.number()
        .required(HEIGHT_VALIDATION.REQUIRED)
        .typeError(HEIGHT_VALIDATION.NUMBER)
        .positive(HEIGHT_VALIDATION.POSITIVE)
        .integer(HEIGHT_VALIDATION.INTEGER),
      weight: Yup.number()
      .required(WEIGHT_VALIDATION.REQUIRED)
      .typeError(WEIGHT_VALIDATION.NUMBER)
      .positive(WEIGHT_VALIDATION.POSITIVE)
      .integer(WEIGHT_VALIDATION.INTEGER),
      age: Yup.number()
      .required(AGE_VALIDATION.REQUIRED)
      .typeError(AGE_VALIDATION.NUMBER)
      .positive(AGE_VALIDATION.POSITIVE)
      .integer(AGE_VALIDATION.INTEGER)
    }),
    onSubmit: (values: FormValues) => {
      const totalCalories = calculateCalorieIntake(values);
      if (totalCalories) {
        setCalculatedCalorie(totalCalories);
      }
    },
  });

  const calculateCalorieIntake = ({
    height,
    weight,
    age,
    gender,
    activityLevel,
  }: FormValues): number => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseInt(age, 10);

    let bmr = 0;
    if (gender === "male") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    return Math.round(bmr * activityLevel.value);
  };

  const saveCalorieToDatabase = async (totalCalories: number) => {
    if (currentUser) {
      try {
        const userDocRef = doc(db, FIREBASE_DOC_REF.USER, currentUser.uid);
        await setDoc(userDocRef, { calorie: totalCalories }, { merge: true });
        toast.success(SUCCESS_MESSAGES().CALORIE_SAVED_SUCCESSFULLY);
        dispatch(setSignout());
      } catch (error) {
        // console.error("Error saving data", error);
        toast.error(ERROR_MESSAGES().ERROR_SAVING_DATA);
      }
    } else {
      toast.error(ERROR_MESSAGES().USER_NOT_AUTHENTICATED);
    }
  };

  const handleSave = async () => {
    if (calculatedCalorie) {
      await saveCalorieToDatabase(calculatedCalorie);
      toast.success(SUCCESS_MESSAGES().SET_CALORIE);
      dispatch(setSignout());
    } else {
      toast.error(ERROR_MESSAGES().CALORIE_NOT_SAVED);
    }
  };

  return (
    <>
   
      <div className="calorie-container">
        <h1 className="calorie-title">Calculate Your Daily Energy Intake</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="input-group">
            <label htmlFor="height">Height (cm):</label>
            <input
              id="height"
              type="text"
              {...formik.getFieldProps("height")}
              placeholder="Enter height in cm"
            />
            {formik.touched.height && formik.errors.height && (
              <p className="error-message">{formik.errors.height}</p>
            )}
          </div>
          <div className="input-group">
            <label htmlFor="weight">Weight (kg):</label>
            <input
              id="weight"
              type="text"
              {...formik.getFieldProps("weight")}
              placeholder="Enter weight in kg"
            />
            {formik.touched.weight && formik.errors.weight && (
              <p className="error-message">{formik.errors.weight}</p>
            )}
          </div>
          <div className="input-group">
            <label htmlFor="age">Age (years):</label>
            <input
              id="age"
              type="text"
              {...formik.getFieldProps("age")}
              placeholder="Enter age in years"
            />
            {formik.touched.age && formik.errors.age && (
              <p className="error-message">{formik.errors.age}</p>
            )}
          </div>
          <div className="input-group">
            <label htmlFor="activity">Activity Level:</label>
            <CustomSelect
              id="activity"
              options={activityOptions}
              value={formik.values.activityLevel}
              onChange={(selectedOption  ) =>
                formik.setFieldValue("activityLevel", selectedOption )
              }
            />
          </div>
          <div className="input-group">
            <label htmlFor="gender">Gender:</label>
            <select
              id="gender"
              {...formik.getFieldProps("gender")}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <button type="submit" className="calculate-button">
            Calculate
          </button>
        </form>
        {calculatedCalorie && (
          <>
            <p className="result">
              You require approximately {calculatedCalorie} kcal daily based on
              your activity level.
            </p>
            <button className="calculate-button" onClick={handleSave}>
              Set Your Daily Meal
            </button>
          </>
        )}
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default CalorieCalculator;
