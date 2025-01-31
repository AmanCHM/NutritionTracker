
import React from "react";
import { useSelector } from "react-redux";
 // Import RootState type
import { useNavigate } from "react-router-dom";
import { RootState } from "../../Store";
import { ROUTES_CONFIG } from "../../Shared/Constants";


// Define types for Redux state slices
interface CalorieGoalState {
  requiredCalorie: number;
  goal: string;
  userName: string;
  weightDifference: number;
}

const ShowCalorie: React.FC = () => {
  const calories = useSelector((state: RootState) => state.Nutrition.requiredCalorie);
  const goal = useSelector((state: RootState) => state.Nutrition.goal);
  const username = useSelector((state: RootState) => state.Nutrition.userName);
  const difference = useSelector((state: RootState) => state.Nutrition.weightDifference);

  const navigate = useNavigate();

  let recommendedCalories = 0;
  let goalDescription = "";

  if (goal === "Loose Weight") {
    recommendedCalories = calories;
    goalDescription = "Lose 0.5 kg weight/week";
  } else if (goal === "Gain Weight") {
    recommendedCalories = calories;
    goalDescription = "Gain 0.5 kg weight/week";
  } else {
    recommendedCalories = calories;
    goalDescription = "Maintain weight";
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

        <div style={{ marginTop: "20px", marginLeft: "5%" }}>
          <button onClick={() => navigate(ROUTES_CONFIG.INPUT_WORKOUT.path)}>Back</button>
          <button
            type="submit"
            style={{
              color: "white",
              marginTop: "20px",
              marginLeft: "35%",
            }}
            onClick={() => navigate("../signup")}
          >
            Create Your Account
          </button>
        </div>
      </div>

    </>
  );
};

export default ShowCalorie;
