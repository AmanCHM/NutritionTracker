import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { RootState } from "../../../Store";
import { openCalorieModal, setActivityLevel, setRequiredCalorie } from "../../../Store/Nutrition";
import CustomSelect, { OptionType } from "../../../Components/Shared/CustomSelect/CustomSelect";
import { ROUTES_CONFIG } from "../../../Shared/Constants";

// Define Activity Option Type
// interface ActivityOption {
//   value: string;
//   label: string;
// }

const Exercise: React.FC = () => {
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
      toast.error("Please select an activity level!");
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

    if (gender === "Male") {
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

    const activityValue = activityMultipliers[activity] || 1.2; // Default to Sedentary if invalid
    const maintenance = Math.round(bmrCurrent * activityValue);

    let recommendedCalories = maintenance;
    if (goal === "Loose Weight") {
      recommendedCalories = maintenance - 550;
    } else if (goal === "Gain Weight") {
      recommendedCalories = maintenance + 550;
    }

    return { recommendedCalories };
  };

  return (
    <>
      {/* <Navbar /> */}
      <div style={{ height: "430px" }}>
        <h3 className="text-center text-gray-600 text-2xl mt-5">
          What is your baseline activity level?
        </h3>
        <h3 className="text-center text-gray-500">
          Not including workouts – we count that separately.
        </h3>

        <div className="calorie-container">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="activity" className="text-lg">
                Select Activity
              </label>
              <CustomSelect
                options={activityOptions}
                value={activityOptions.find((option) => option.value === activity ) || null}
                onChange={(selectedOption) => setActivity(selectedOption?.value as string)}
                placeholder="Select an Option"
              />
            </div>

            {/* Navigation Buttons */}
            <div className="form-buttons mt-5">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate("/input-weight")}
              >
                Back
              </button>
              <button type="submit" className="btn-primary ml-10">
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default Exercise;
