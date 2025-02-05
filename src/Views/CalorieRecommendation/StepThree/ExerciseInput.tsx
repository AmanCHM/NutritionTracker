import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { RootState } from "../../../Store";
import { openCalorieModal, setActivityLevel, setRequiredCalorie } from "../../../Store/Nutrition";
import CustomSelect, { OptionType } from "../../../Components/Shared/CustomSelect/CustomSelect";
import {  GENDER_OPTION, ROUTES_CONFIG, VALIDATION, WEIGHT } from "../../../Shared/Constants";
import CustomButton from "../../../Components/Shared/CustomButton/CustomButton";
import { Formik } from "formik";
import { ERROR_MESSAGES, GREETINGS, LABEL } from "../../../Shared";



const ExerciseInput: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // user details from Redux store
  const height = useSelector((state: RootState) => state.Nutrition.height);
  const weight = useSelector((state: RootState) => state.Nutrition.currentWeight);
  const age = useSelector((state: RootState) => state.Nutrition.age);
  const gender = useSelector((state: RootState) => state.Nutrition.gender);
  const goal = useSelector((state: RootState) => state.Nutrition.goal);
  const activities = useSelector((state: RootState) => state.Nutrition.activity);

  // State for selected activity
  const [activity, setActivity] = useState<string>(activities || "");

  type OptionType = {
    value: string ;
    label: string;
  };
  // Activity Options
  const activityOptions: OptionType[]= [
    { value: "Sedentary (little to no exercise)", label: "Sedentary (little to no exercise)" },
    { value: "Lightly active (light exercise 1-3 days/week)", label: "Lightly active (light exercise 1-3 days/week)" },
    { value: "Moderately active (moderate exercise 3-5 days/week)", label: "Moderately active (moderate exercise 3-5 days/week)" },
    { value: "Very active (hard exercise 6-7 days/week)", label: "Very active (hard exercise 6-7 days/week)" },
    { value: "Extra active (very hard exercise or a physical job)", label: "Extra active (very hard exercise or a physical job)" },
  ];

  // Handle Form Submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!activity) {
      toast.error(ERROR_MESSAGES().SELECT_ACTIVITY_LEVEL);
      return;
    }

    dispatch(setActivityLevel(activity));
    dispatch(openCalorieModal());

    const { recommendedCalories } = calculateCalories();
    dispatch(setRequiredCalorie(recommendedCalories));

    navigate(ROUTES_CONFIG.CALORIE_NEED.path);
  };

  // Function to Calculate Calories
  const calculateCalories = () => {
    let bmrCurrent = 0;

    if (gender === GENDER_OPTION.MALE) {
      bmrCurrent = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmrCurrent = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const activityMultipliers: Record<string, number> = {
      "Sedentary (little to no exercise)": 1.2,
      "Lightly active (light exercise 1-3 days/week)": 1.375,
      "Moderately active (moderate exercise 3-5 days/week)": 1.55,
      "Very active (hard exercise 6-7 days/week)": 1.725,
      "Extra active (very hard exercise or a physical job)": 1.9,
    };

    const activityValue = activityMultipliers[activity] || 1.2; 
    const maintenance = Math.round(bmrCurrent * activityValue);

    let recommendedCalories = maintenance;
    if (goal === WEIGHT.LOOSE_WEIGHT) {
      recommendedCalories = maintenance - 550;
    } else if (goal === WEIGHT.GAIN_WEIGHT) {
      recommendedCalories = maintenance + 550;
    }

    return { recommendedCalories };
  };

  return (
    <>
       <div style={{ height: "430px" }}>
        <h3
          style={{
            fontSize: "2.3rem",
            color: "#737373",
            textAlign: "center",
            marginTop: "5%",
          }}
        >
          {GREETINGS.ACTIVITY_LABEL}
        </h3>
        <h3 style={{ textAlign: "center", color: "#627373" }}>
        {GREETINGS.WORKOUT_LABEL}
        </h3>

        <div className="calorie-container">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="activity" style={{ fontSize: "1.2rem" }}>
                {LABEL.SELECT_ATIVITY}
              </label>
               <CustomSelect
                options={activityOptions}
                value={activityOptions.find((option) => option.value === activity ) || null}
                onChange={(selectedOption) => setActivity(selectedOption?.value as string)}
                placeholder={VALIDATION.SELECT_OPTION}
              />
            </div>
            <div style={{ marginTop: "20px", marginLeft: "5%" }}>

        
              <CustomButton
            type="submit"
            size={"medium"}
            onClick={()=>  navigate(ROUTES_CONFIG.INPUT_WEIGHT.path)}
            label={"Back"}
          >
    
          </CustomButton>

              <CustomButton
            type="submit"
            style={{ marginLeft: "60%" }}
            size={"medium"}
          
            label={"Next"}
          >
            
          </CustomButton>

            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ExerciseInput;
