import React from "react";
import "../Meal/MealModal.css";
import { SelectedFoodData } from "../../Dashboard";

interface NutritionModalProps {
  onClose: () => void;
  selectedFoodData: SelectedFoodData;
}



const NutritionModal: React.FC<NutritionModalProps> = ({ onClose, selectedFoodData }) => {
  // Fetch the details of selected item

  const foodItem = selectedFoodData?.foods?.[0] || null;

const foods = foodItem || 0;
const calculateCalories: number = foodItem?.nf_calories || 0;
const protein = foodItem?.nf_protein || 0;
const carbs = foodItem?.nf_total_carbohydrate || 0;
const fats = foodItem?.nf_total_fat || 0;
const serving = foodItem?.serving_unit || 0;
const image = foodItem?.photo?.thumb || " ";

      const tableStyle = { padding:'8px'}
  return (
    <>
      <div className="logout-modal-content">
        <h2>Nutritional Facts</h2>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img src={image} alt="Food" />
        </div>

        <h3 style={{ color: "#063970", textAlign: "center", paddingTop: "10px" }}>
          {selectedFoodData?.foods[0]?.food_name?.charAt(0).toUpperCase() +
            selectedFoodData?.foods[0]?.food_name?.slice(1)}
        </h3>

        <table style={{ width: "100%", borderCollapse: "collapse", color: "black" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "8px" }}>
                Nutrient
              </th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "8px" }}>
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tableStyle}>Serving Size</td>
              <td style={tableStyle}>{(calculateCalories ) > 0 ? `${serving}` : ""}
</td>
            </tr>
            <tr>
              <td style={tableStyle}>Calories</td>
              <td style={tableStyle}>
                {calculateCalories > 0 ? Math.floor(calculateCalories) : 0} kcal
              </td>
            </tr>
            <tr>
              <td style={tableStyle}>Total Fat</td>
              <td style={tableStyle}>
                {calculateCalories  > 0 ? Math.floor(fats ) : 0} g
              </td>
            </tr>
            <tr>
              <td style={tableStyle}>Total Carbohydrate</td>
              <td style={tableStyle}>
                {calculateCalories  > 0 ? Math.floor(carbs  ) : 0} g
              </td>
            </tr>
            <tr>
              <td style={tableStyle}>Protein</td>
              <td style={tableStyle}>
                {calculateCalories  > 0 ? Math.floor(protein ) : 0} g
              </td>
            </tr>
          </tbody>
        </table>
        <button onClick={onClose} className="modalClose-button" style={{ marginTop: "15px" }}>
          Close
        </button>
      </div>
    </>
  );
};

export default NutritionModal;
