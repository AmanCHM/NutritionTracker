import React, { FormEvent, useEffect, useState } from "react";
import "../Nutrition/NutritionModal.css";
import CustomSelect from "../../../../Components/Shared/CustomSelect/CustomSelect";
import { FoodData, LogData, SelectedFoodData } from "../../Dashboard";
import { FORM_VALIDATION_MESSAGES } from "../../../../Shared";
import { MEALTYPE, VALIDATION } from "../../../../Shared/Constants";


// Define types for the food data and props
interface Measure {
  serving_weight: number;
  measure: string;
}

interface EditDataModalProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  selectquantity: number ;
  setSelectquantity: (selectquantity: number) => void;
  selectedFoodData: SelectedFoodData;
  selectCategory: string;
  setSelectCategory: React.Dispatch<React.SetStateAction<string>>;
  calculateCalories: number | string;
  handleEditModalData: (
    selectedFoodData?: FoodData | null,
    calculateCalories?: number,
    protein?: number,
    carbs?: number,
    fats?: number,
    altMeasure?: string,
    selectquantity?: number,
    editMealName?: keyof LogData,
    selectedId?: number | string,
    selectCategory?: string,
    setLogdata?: (data: LogData) => void,
    setEditModal?: (value: boolean) => void,
    setSelectCategory?: () => void
  ) 
    => void;
  mealName: string |undefined;
}

const UpdateMeal: React.FC<EditDataModalProps> = ({
  setModal,
  quantity,
  setQuantity,
  selectquantity,
  setSelectquantity,
  selectedFoodData,
  selectCategory,
  setSelectCategory,
  calculateCalories,
  handleEditModalData,
  mealName
}) => {
  const [errors, setErrors] = useState({
    quantity: "",
    selectquantity: "",
    selectCategory: "",
  });

  // Validate Quantity
  const validateQuantity = (value: number): string => {
    if (!value || value <= 0) {
      return FORM_VALIDATION_MESSAGES().VALID_QUANTITY;
    }
    return "";
  };

  // Validate Select Quantity
  const validateSelectQuantity = (value: string | number): string => {
    if (!value) {
      return FORM_VALIDATION_MESSAGES().SELECT_QUANTITY;
    }
    return "";
  };

  // Validate Meal Category
  const validateMealCategory = (value: string): string => {
    if (!value) {
      return FORM_VALIDATION_MESSAGES().CHOOSE_MEAL_CATEGORY;
    }
    return "";
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    const newErrors = { ...errors };

    // Trigger validation on blur
    if (name === VALIDATION.QUANTITY) {
      newErrors.quantity = validateQuantity(Number(value));
    }
    if (name === VALIDATION.SELECT_QUANTITY) {
      newErrors.selectquantity = validateSelectQuantity(value);
    }
    if (name === VALIDATION.SELECT_CATEGORY) {
      newErrors.selectCategory = validateMealCategory(value);
    }

    setErrors(newErrors);
  };

  const handleSubmit =  (e: FormEvent): void => {
    e.preventDefault();

    const newErrors = {
      quantity: validateQuantity(quantity),
      selectquantity: validateSelectQuantity(selectquantity),
      selectCategory: validateMealCategory(selectCategory),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => !error)) {
      handleEditModalData();
    }
  };

  const mealOptions = [
    { value: MEALTYPE.BREAKFAST, label: MEALTYPE.BREAKFAST },
    { value: MEALTYPE.LUNCH, label:MEALTYPE.LUNCH},
    { value: MEALTYPE.SNACK, label:  MEALTYPE.SNACK},
    { value: MEALTYPE.DINNER, label: MEALTYPE.DINNER },
  ];


  const sliceOptions = selectedFoodData?.foods.flatMap((food, foodIndex) =>
    food.alt_measures.map((measure, index) => ({
      value: measure.serving_weight,
      label: measure.measure,
      key: `${foodIndex}-${index}`,
    }))
  ) || [];
  useEffect(() => {
    if (mealName) {
      setSelectCategory(mealName);
    }
  }, [mealName, setSelectCategory]);


  ;
  return (
    <>
      <div>
        <button className="close-button" onClick={() => setModal(false)}>
          X
        </button>
        <h2 className="modal-title" style={{ color: "black" }}>
          Update Meal
        </h2>

        <h3 style={{ color: "#063970", textAlign: 'center', paddingTop: '10px' }}>
          {selectedFoodData?.foods[0]?.food_name?.charAt(0).toUpperCase() +
            selectedFoodData?.foods[0]?.food_name?.slice(1)}
        </h3>

        <div className="input-container">
          <label>Choose Quantity</label>
          <input
            type="number"
            name="quantity"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            onBlur={handleBlur}
            step="1"
          />
          {errors.quantity && <div style={{ color: "red" }}>{errors.quantity}</div>}
        </div>

        <div className="select-container">
          <label>Select Serving Size</label>
          <CustomSelect
            options={sliceOptions}
            value={
              selectquantity
                ? {
                    value: selectquantity,
                    label: selectedFoodData?.foods
                      .flatMap((food) => food.alt_measures)
                      .find((measure) => measure.serving_weight === selectquantity)?.measure || '',
                  }
                : null
            }
            onChange={(selectedOption) => setSelectquantity(selectedOption?.value  as number )

            
            }
            onBlur={handleBlur}
          />
          {errors.selectquantity && <div style={{ color: "red" }}>{errors.selectquantity}</div>}
        </div>

        <label className="meal-label">Choose Meal</label>
        <CustomSelect
          options={mealOptions}
          value={mealOptions.find((option) => option.value === selectCategory) || null}
          onChange={(selectedOption) => setSelectCategory(selectedOption?.value as string) }
          onBlur={handleBlur}
        />
        {errors.selectCategory && <div style={{ color: "red" }}>{errors.selectCategory}</div>}

        <p className="calorie-info">Calorie Served: {Math.round(calculateCalories as number)}</p>

        <button className="add-meal-button" onClick={handleSubmit}>
          Update Meal
        </button>
      </div>
    </>
  );
};

export default UpdateMeal;
