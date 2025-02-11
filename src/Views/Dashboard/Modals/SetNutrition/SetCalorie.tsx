import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../../../Store";
import { auth, db } from "../../../../Utils/firebase";
import { closeCalorieModal, resetGoal } from "../../../../Store/Nutrition";
import { setSignout } from "../../../../Store/Auth";
import { FIREBASE_DOC_REF, ROUTES_CONFIG } from "../../../../Shared/Constants";
import { ERROR_MESSAGES, GREETINGS, LABEL } from "../../../../Shared";
import CustomButton from "../../../../Components/Shared/CustomButton/CustomButton";

interface SetCalorieModalProps {
  setEnergyModal: (value: boolean) => void;
}

const SetCalorieModal: React.FC<SetCalorieModalProps> = ({
  setEnergyModal,
}) => {
  const user = useSelector((state: RootState) => state.Nutrition.userName);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const calories = useSelector(
    (state: RootState) => state?.Nutrition?.requiredCalorie
  );
  const goal = useSelector((state: RootState) => state.Nutrition.goal);
  const recommendedData = useSelector(
    (state: RootState) => state.Nutrition.showrecommendation
  );
  let recommendedCalories = 0;
  let goalDescription = "";

  if (goal === LABEL.LOOSE) {
    recommendedCalories = calories;
    goalDescription = LABEL.LOSE_RECOMMENDATION;
  } else if (goal === LABEL.GAIN) {
    recommendedCalories = calories;
    goalDescription = LABEL.GAIN_RECOMMENDATION;
  } else {
    recommendedCalories = calories;
    goalDescription = LABEL.MAINTAIN_RECOMMENDATION;
  }

  const handlesetCalorie = async () => {
    const currentUser = auth.currentUser;
    const userId = currentUser?.uid;
    if (userId) {
      try {
        const userDocRef = doc(db, FIREBASE_DOC_REF.USER, userId);
        await setDoc(userDocRef, { calorie: calories }, { merge: true });
      } catch (error) {
        console.error(ERROR_MESSAGES().ERROR_FETCH, error);
      } finally {
        dispatch(closeCalorieModal());
        dispatch(setSignout());
        dispatch(resetGoal());
        setEnergyModal(false);
      }
    }
  };

  const handlePlan = () => {
    setEnergyModal(false);
    dispatch(setSignout());
    navigate(ROUTES_CONFIG.CALORIE_CALCULATOR.path);
  };

  return (
    <>
      <CustomButton
        className="close-button"
        label={LABEL.CLOSE}
        onClick={() => setEnergyModal(false)}
      ></CustomButton>

      {recommendedData ? (
        <div style={{ paddingTop: "50px", textAlign: "center" }}>
          <h3
            style={{ color: "#627373", fontWeight: "bold", fontSize: "24px" }}
          >
            {GREETINGS.WELCOME_NUTRITRACK}
          </h3>
          <h2>
            {" "}
            {GREETINGS.GREET} {user} {LABEL.CALORIE_REQUIREMENT}
          </h2>
          <div className="calorie-data">
            <ul>
              <li>
                <strong>{LABEL.YOUR_GOAL}</strong>{" "}
                {goalDescription.charAt(0).toUpperCase() +
                  goalDescription.slice(1)}
              </li>
              <li>
                <strong>{LABEL.RECOMMENDED_CALORIE}</strong>{" "}
                {recommendedCalories} {LABEL.KCAL_PER_DAY}
              </li>
            </ul>
          </div>
          <CustomButton className="submit-button" onClick={handlesetCalorie} label= {LABEL.SET_CALORIE}>
           
          </CustomButton>

          <p style={{ marginTop: "15px", fontSize: "14px", color: "#627373" }}>
            {LABEL.CUSTOMISE_NUTRI_PLAN}
            <Link
              to={ROUTES_CONFIG.CALORIE_CALCULATOR.path}
              style={{
                color: "blue",
                fontWeight: "bold",
              }}
            >
              {LABEL.CLICK_HERE}
            </Link>
          </p>
        </div>
      ) : (
        <div style={{ paddingTop: "50px", textAlign: "center" }}>
          <h3
            style={{ color: "#627373", fontWeight: "bold", fontSize: "24px" }}
          >
            {GREETINGS.WELCOME_NUTRITRACK}
          </h3>
          <p style={{ color: "#4A4A4A", fontSize: "16px", margin: "10px 0" }}>
            {GREETINGS.NUTRI_PLAN_GREET}
          </p>

          <CustomButton
            className="submit-button"
            label={LABEL.CLICK_HERE}
            style={{ marginTop: "120px" }}
            onClick={handlePlan}
          ></CustomButton>
        </div>
      )}
    </>
  );
};

export default SetCalorieModal;
