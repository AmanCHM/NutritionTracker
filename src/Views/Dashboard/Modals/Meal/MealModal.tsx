import React, { useState, ChangeEvent, FocusEvent, FormEvent, useMemo } from "react";
import CustomSelect, {
  OptionType,
} from "../../../../Components/Shared/CustomSelect/CustomSelect";
import { SelectedFoodData } from "../../Dashboard";
import { User } from "firebase/auth";

interface Measure {
  serving_weight: number;
  measure: string;
}

interface SelectItem {
  label: string;
}

interface MealModalProps {
  modal: boolean;
  setModal: (modal: boolean) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  selectquantity: number;
  setSelectquantity: (value: number) => void;
  selectedFoodData: SelectedFoodData;
  setSelectCategory: (category: string) => void;
  calculateCalories: number | string;
  handleModalData: (
    selectquantity?: number | null,
    selectCategory?: string | null,
    quantity?: number | null,
    selectItem?: SelectItem,
    calculateCalories?: number,
    protein?: number,
    carbs?: number,
    fats?: number,
    altMeasure?: string,
    handleGetData?: (user: User) => Promise<void>,
    setModal?: (value: boolean) => void,
    setSelectCategory?: () => void
  ) => void;
  selectCategory: string;
  setAltMeasure: (measure: string) => void;
}

interface Food {
  alt_measures: Measure[];
}

interface FoodData {
  foods: Food[];
}

const MealModal: React.FC<MealModalProps> = ({
  modal,
  setModal,
  quantity,
  setQuantity,
  selectquantity,
  setSelectquantity,
  selectedFoodData,
  setSelectCategory,
  calculateCalories,
  handleModalData,
  selectCategory,
  setAltMeasure,
}) => {

  // const [food ,setFood] = useState<();
  const sliceOptions =
    selectedFoodData?.foods.flatMap((food, foodIndex) =>
      food.alt_measures.map((measure, index) => ({
        value: measure.serving_weight,
        label: measure.measure,
        key: `${foodIndex}-${index}`,
      }))
    ) || [];

  const mealOptions = [
    { value: "Breakfast", label: "Breakfast" },
    { value: "Lunch", label: "Lunch" },
    { value: "Snack", label: "Snack" },
    { value: "Dinner", label: "Dinner" },
  ];


  // Fetch image
  const image =
    selectedFoodData?.foods.length > 0
      ? selectedFoodData?.foods[0]?.photo?.thumb
      : "no data";

  const [errors, setErrors] = useState<{
    quantity: string;
    selectquantity: string;
    selectCategory: string;
  }>({
    quantity: "",
    selectquantity: "",
    selectCategory: "",
  });

  // Validate Quantity
  const validateQuantity = (value: number): string => {
    if (!value || value <= 0) {
      return "Please enter a valid quantity.";
    }
    return "";
  };

  // Validate Select Quantity
  const validateSelectQuantity = (value: number): string => {
    if (!value || value <= 0) {
      return "Please select serving size.";
    }
    return "";
  };

  // Validate Meal Category
  const validateMealCategory = (value: string): string => {
    if (!value) {
      return "Please choose a meal category.";
    }
    return "";
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    const newErrors = { ...errors };

    // Trigger validation on blur
    if (name === "quantity") {
      newErrors.quantity = validateQuantity(quantity);
    }
    if (name === "selectquantity") {
      newErrors.selectquantity = validateSelectQuantity(selectquantity);
    }
    if (name === "selectCategory") {
      newErrors.selectCategory = validateMealCategory(value);
    }

    setErrors(newErrors);
  };

  // Set the meal modal
  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();

    const newErrors = {
      quantity: validateQuantity(quantity),
      selectquantity: validateSelectQuantity(selectquantity),
      selectCategory: validateMealCategory(selectCategory),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => !error)) {
      handleModalData();
    }
  };

  console.log("selecttquantity",selectquantity);
  // console.log(selectedOption);
  return (
    <>
      <div>
        <button className="close-button" onClick={() => setModal(false)}>
          X
        </button>
        <h2>Select Meal</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={image} alt="" />
        </div>
        <h3
          style={{ color: "#063970", textAlign: "center", paddingTop: "10px" }}
        >
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
            onChange={(e) => {
              const value = e.target.valueAsNumber;
              setQuantity(value);
            }}
            onBlur={handleBlur}
            step="1"
          />
          {errors.quantity && (
            <div style={{ color: "red" }}>{errors.quantity}</div>
          )}
        </div>

        <div className="select-container">
          <label>Select Serving Size</label>
          <CustomSelect
            placeholder="Choose a meal"
            options={sliceOptions}
            value={
              selectquantity
                ? {
                    value: selectquantity,
                    label: selectedFoodData?.foods
                        .flatMap((food) => food.alt_measures)
                        .find((measure) => measure.serving_weight == selectquantity)
                        ?.measure || "No label",
                  }
                : null
            }
           
            onChange={(selectedOption) => {
              const selectedMeasure = selectedFoodData?.foods
                .flatMap((food) => food.alt_measures)
                .find((measure) => measure.serving_weight === selectedOption?.value);
                setSelectquantity(selectedOption?.value as number);
              console.log(selectquantity);
              setAltMeasure(selectedMeasure?.measure || '');
            }}

            // onBlur={handleBlur}
            
            
          />
          {errors.selectquantity && (
            <div style={{ color: "red" }}>{errors.selectquantity}</div>
          )}
        </div>

        <label className="meal-label">Choose Meal</label>
        <CustomSelect
          options={mealOptions}
          value={
            mealOptions.find((option) => option.value === selectCategory) ||
            null
          }
          onChange={(selectedOption) =>
            setSelectCategory(selectedOption?.value as string )
          }
          onBlur={handleBlur}
        />
        {errors.selectCategory && (
          <div style={{ color: "red" }}>{errors.selectCategory}</div>
        )}

        <p className="calorie-info">
          Calorie Served: {Math.round(calculateCalories as number)}
        </p>
        <button className="add-meal-button" onClick={handleSubmit}>
          Add Meal
        </button>
      </div>
    </>
  );
};

export default MealModal;




  // const foodOptions =
  //   selectedFoodData?.foods
  //     .flatMap((food) => food.alt_measures)
  //     .map((measure) => ({
  //       value: measure.serving_weight,
  //       label: measure.measure,
  //     })) || [];

  // console.log("foodoptions", foodOptions);

  // const selectedOption =
  //   foodOptions.find((option) => option.value === selectquantity) || null;

