import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../../../../Store";
import { auth, db } from "../../../../../Utils/firebase";
import { closeCalorieModal, resetGoal } from "../../../../../Store/Nutrition";
import { setSignout } from "../../../../../Store/Auth";
import { ROUTES_CONFIG } from "../../../../../Shared/Constants";

interface SetCalorieModalProps {
  setEnergyModal: (value: boolean) => void; 
}

const SetCalorieModal :React.FC<SetCalorieModalProps> = ({ setEnergyModal }) => {


  const user = useSelector((state:RootState)=>state.Nutrition.userName);
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const calories = useSelector(
    (state:RootState) => state?.Nutrition?.requiredCalorie
  );
  const goal = useSelector((state:RootState) => state.Nutrition.goal);
  const recommendedData = useSelector(
    (state:RootState) => state.Nutrition.showrecommendation
  );
  let recommendedCalories = 0;
  let goalDescription = "";

  if (goal === "loose") {
    recommendedCalories = calories;
    goalDescription = "to lose  0.5 kg weight/week ";
  } else if (goal === "gain") {
    recommendedCalories = calories;
    goalDescription = "to gain 0.5 kg weight/week";
  } else {
    recommendedCalories = calories;
    goalDescription = "to maintain weight";
  }

  const handlesetCalorie = async () => {
    const currentUser = auth.currentUser;
    const userId = currentUser?.uid;
    if (userId) {
      try {
        const userDocRef = doc(db, "users", userId);
        await setDoc(userDocRef, { calorie: calories }, { merge: true });
      } catch (error) {
        console.error("Error saving  data", error);
      } finally {
        dispatch(closeCalorieModal())
        dispatch(setSignout())
        dispatch(resetGoal());
        setEnergyModal(false); 
      }
    }
  };

  const handlePlan  = ()=>{
    setEnergyModal(false);
    dispatch(setSignout())
    
    navigate(ROUTES_CONFIG.CALORIE_CALCULATOR.path)

  }

  return (
    <>
      <button className="close-button" onClick={() => setEnergyModal(false)}>
        X
      </button>

      {recommendedData ? (
        <div  style={{ paddingTop: "50px", textAlign: "center" }}>
            <h3
            style={{ color: "#627373", fontWeight: "bold", fontSize: "24px" }}
          >
            Welcome to Your Nutrition Journey! 🌟
          </h3>
          <h2>Hi {user}! Your Calorie Requirements</h2>
          <div className="calorie-data">
            <ul>
              <li>
                <strong>Your Goal:</strong>{" "}
                {goalDescription.charAt(0).toUpperCase() + goalDescription.slice(1)}
              </li>
              <li>
                <strong>Recommended Calories:</strong> {recommendedCalories}{" "}
                kcal/day
              </li>
            </ul>
          </div>
          <button className="submit-button" onClick={handlesetCalorie}>
            Set Calorie
          </button>

         
          <p style={{ marginTop: "15px", fontSize: "14px", color: "#627373" }}>
          Customize your nutrition plan manually :
    <Link
      to="/calorie-calculator"
      style={{
        color: "blue",
        fontWeight: "bold",
      }}
    >
      click here
    </Link>
  </p>
        </div>
      ) : (
        <div style={{ paddingTop: "50px", textAlign: "center" }}>
          <h3
            style={{ color: "#627373", fontWeight: "bold", fontSize: "24px" }}
          >
            Welcome to Your Nutrition Journey! 🌟
          </h3>
          <p style={{ color: "#4A4A4A", fontSize: "16px", margin: "10px 0" }}>
            Start your path to a healthier you today. Let’s create a
            personalized plan tailored just for you!
          </p>
          {/* <Link to="/calorie-calculator"> */}
            <button className="submit-button" style={{ marginTop: "120px" }} onClick={handlePlan}>
              Click here
            </button>
          {/* </Link> */}
        </div>
      )}
    </>
  );
};

export default SetCalorieModal;