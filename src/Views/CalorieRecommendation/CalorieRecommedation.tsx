
import React from "react";
import { useSelector } from "react-redux";
 // Import RootState type
import { useNavigate } from "react-router-dom";
import { RootState } from "../../Store";
import { ROUTES_CONFIG, WEIGHT } from "../../Shared/Constants";
import CustomButton from "../../Components/Shared/Form/CustomButton/CustomButton";


// Define types for Redux state slices
interface CalorieGoalState {
  requiredCalorie: number;
  goal: string;
  userName: string;
  weightDifference: number;
}

const CalorieRecommendation: React.FC = () => {
  const calories = useSelector((state: RootState) => state.Nutrition.requiredCalorie);
  const goal = useSelector((state: RootState) => state.Nutrition.goal);
  const username = useSelector((state: RootState) => state.Nutrition.userName);
  const difference = useSelector((state: RootState) => state.Nutrition.weightDifference);

  const navigate = useNavigate();

  let recommendedCalories = 0;
  let goalDescription = "";

  if (goal === WEIGHT.LOOSE_WEIGHT) {
    recommendedCalories = calories;
    goalDescription = WEIGHT.LOOSE_WEIGHT_DESCRPTION;
  } else if (goal === WEIGHT.GAIN_WEIGHT) {
    recommendedCalories = calories;
    goalDescription = WEIGHT.GAIN_WEIGHT_DESCRIPTION;
  } else {
    recommendedCalories = calories;
    goalDescription = WEIGHT.MAINTAIN_WEIGHT;
  }

  return (
    <>


      <h3
        style={{
          fontSize: "2.3rem",
          color: "#737373",
          textAlign: "center",
          marginTop: "5%",
        }}
      >
        What is your weekly goal?
      </h3>
      <h3 style={{ textAlign: "center", color: "#627373" }}>
        Let's break down your overall health goal into a weekly one you can
        maintain. <br /> Slow-and-steady is best!
      </h3>

      <div className="calorie-container" style={{ height: "300px" }}>
        <h2>Hi! {username}, Your Calorie Requirements</h2>
        <div className="calorie-data">
          <ul>
            <p
              style={{
                color: "black",
                fontSize: "17px",
                marginLeft: "30%",
                marginTop: "10px",
              }}
            >
              {goalDescription.charAt(0).toUpperCase() + goalDescription.slice(1)}
            </p>

            <p
              style={{
                color: "black",
                fontSize: "17px",
                marginLeft: "20%",
                marginTop: "10px",
              }}
            >
              <strong>Recommended Calories:</strong> {recommendedCalories} kcal/day
            </p>
            
          </ul>
        </div>

      
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
            }}
            >
           
            <CustomButton
            type="submit"
            size={"medium"}
            onClick={() =>  navigate(ROUTES_CONFIG.INPUT_WORKOUT.path)}
            label={"Back"}
             >
            </CustomButton>
           
            <CustomButton
            type="submit"
            style={{ marginLeft: "20" }}
            size={"medium"}
            onClick={() =>  navigate(ROUTES_CONFIG.REGISTER.path)}
            label={"Create Your Account"}
             >
            
             </CustomButton>
          </div>
        </div>
      {/* </div> */}

    </>
  );
};

export default CalorieRecommendation;
