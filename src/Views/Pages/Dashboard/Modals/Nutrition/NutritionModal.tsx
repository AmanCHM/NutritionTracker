import React from "react";
import "./MealModal.css";
import { SelectedFoodData } from "../../Dashboard";

// Define the types for the props
// interface Food {
//   food_name: string;
//   nf_calories: number;
//   nf_protein: number;
//   nf_total_carbohydrate: number;
//   nf_total_fat: number;
//   serving_unit: string;
//   photo: {
//     thumb: string;
//   };
// }

// interface SelectedFoodData {
//   foods: Food[];
// }


interface NutritionModalProps {
  onClose: () => void;
  selectedFoodData: SelectedFoodData;
}

const NutritionModal: React.FC<NutritionModalProps> = ({ onClose, selectedFoodData }) => {
  // Fetch the details of selected item
  const calculateCalories  :number =
    selectedFoodData?.foods?.length > 0
      ? selectedFoodData?.foods[0].nf_calories : 0;
      

  const protein =
    selectedFoodData?.foods?.length > 0
      ? selectedFoodData?.foods[0].nf_protein
      : 0;

  const carbs =
    selectedFoodData?.foods?.length > 0
      ? selectedFoodData?.foods[0].nf_total_carbohydrate
      : 0;

  const fats =
    selectedFoodData?.foods?.length > 0
      ? selectedFoodData?.foods[0].nf_total_fat
      : 0;

  const serving =
    selectedFoodData?.foods?.length > 0
      ? selectedFoodData?.foods[0].serving_unit
      : 0;

  const image =
    selectedFoodData?.foods?.length > 0
      ? selectedFoodData?.foods[0]?.photo?.thumb
      : " ";

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
              <td style={{ padding: "8px" }}>Serving Size</td>
              <td style={{ padding: "8px" }}>{(calculateCalories ) > 0 ? `${serving}` : ""}
</td>
            </tr>
            <tr>
              <td style={{ padding: "8px" }}>Calories</td>
              <td style={{ padding: "8px" }}>
                {calculateCalories > 0 ? Math.floor(calculateCalories) : 0} kcal
              </td>
            </tr>
            <tr>
              <td style={{ padding: "8px" }}>Total Fat</td>
              <td style={{ padding: "8px" }}>
                {calculateCalories  > 0 ? Math.floor(fats ) : 0} g
              </td>
            </tr>
            <tr>
              <td style={{ padding: "8px" }}>Total Carbohydrate</td>
              <td style={{ padding: "8px" }}>
                {calculateCalories  > 0 ? Math.floor(carbs  ) : 0} g
              </td>
            </tr>
            <tr>
              <td style={{ padding: "8px" }}>Protein</td>
              <td style={{ padding: "8px" }}>
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
