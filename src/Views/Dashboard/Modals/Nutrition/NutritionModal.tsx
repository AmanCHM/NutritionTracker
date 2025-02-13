import React from "react";
import "../Meal/MealModal.css";
import { SelectedFoodData } from "../../Dashboard";
import { FORM, LABEL } from "../../../../Shared";
import { NUTRIENT } from "../../../../Shared/Constants";
import { capitalizeFirstLetter, getImage } from "../../../../Helpers/function";
import CustomButton from "../../../../Components/Shared/CustomButton/CustomButton";

interface NutritionModalProps {
  onClose: () => void;
  selectedFoodData: SelectedFoodData;
}

const NutritionModal: React.FC<NutritionModalProps> = ({
  onClose,
  selectedFoodData,
}) => {
  // Fetch the details of selected item

  const foodItem = selectedFoodData?.foods?.[0] || null;

  const foods = foodItem || 0;
  const calculateCalories: number = foodItem?.nf_calories || 0;
  const protein = foodItem?.nf_protein || 0;
  const carbs = foodItem?.nf_total_carbohydrate || 0;
  const fats = foodItem?.nf_total_fat || 0;
  const serving = foodItem?.serving_unit || 0;
  const image  = getImage(selectedFoodData)


  const tableStyle = { padding: "8px" };

  const foodName = capitalizeFirstLetter(selectedFoodData?.foods[0]?.food_name);
  return (
    <>
      <div className="logout-modal-content">
        <h2>{LABEL.NUTRI_FACTS}</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={image} alt="Food" />
        </div>

        <h3
          style={{ color: "#063970", textAlign: "center", paddingTop: "10px" }}
        >
          {foodName}
        </h3>

        <table
          style={{ width: "100%", borderCollapse: "collapse", color: "black" }}
        >
          <thead>
            <tr>
              <th
                style={{
                  borderBottom: "1px solid #ccc",
                  textAlign: "left",
                  padding: "8px",
                }}
              >
                {LABEL.NUTRIENT}
              </th>
              <th
                style={{
                  borderBottom: "1px solid #ccc",
                  textAlign: "left",
                  padding: "8px",
                }}
              >
                {LABEL.AMOUNT}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tableStyle}>{LABEL.SERVING_SIZE}</td>
              <td style={tableStyle}>
                {calculateCalories > 0 ? `${serving}` : ""}
              </td>
            </tr>
            <tr>
              <td style={tableStyle}>{NUTRIENT.CALORIE}</td>
              <td style={tableStyle}>
                {calculateCalories > 0 ? Math.floor(calculateCalories) : 0}{" "}
                {FORM.KCAL}
              </td>
            </tr>
            <tr>
              <td style={tableStyle}> {NUTRIENT.FATS}</td>
              <td style={tableStyle}>
                {calculateCalories > 0 ? Math.floor(fats) : 0} {FORM.GM}
              </td>
            </tr>
            <tr>
              <td style={tableStyle}>{NUTRIENT.CARBS}</td>
              <td style={tableStyle}>
                {calculateCalories > 0 ? Math.floor(carbs) : 0} {FORM.GM}
              </td>
            </tr>
            <tr>
              <td style={tableStyle}>{NUTRIENT.PROTEIN}</td>
              <td style={tableStyle}>
                {calculateCalories > 0 ? Math.floor(protein) : 0} {FORM.GM}
              </td>
            </tr>
          </tbody>
        </table>
        <CustomButton
          onClick={onClose}
          className="modalClose-button"
          style={{ marginTop: "15px" }}
         label= {LABEL.CLOSE_TEXT}
        >
        </CustomButton>
      </div>
    </>
  );
};

export default NutritionModal;
