import React, { FormEvent, useCallback, useEffect, useState } from "react";
import "../Nutrition/NutritionModal.css";
import CustomSelect from "../../../../Components/Shared/CustomSelect/CustomSelect";
import { FoodData, LogData, SelectedFoodData } from "../../Dashboard";
import { FORM_VALIDATION_MESSAGES, LABEL } from "../../../../Shared";
import {
  MEALTYPE,
  VALIDATION,
  mealOptions,
} from "../../../../Shared/Constants";
import {
  capitalizeFirstLetter,

  getImage,
  getSliceOptions,
    
  validateMealCategory,
  validateQuantity,
  validateSelectQuantity,
} from "../../../../Helpers/function";
import CustomButton from "../../../../Components/Shared/CustomButton/CustomButton";

// Define types for the food data and props
interface Measure {
  serving_weight: number;
  measure: string;
}

interface EditDataModalProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  selectquantity: number;
  setSelectquantity: (selectquantity: number) => void;
  selectedFoodData: SelectedFoodData;
  selectCategory: string;
  setSelectCategory: React.Dispatch<React.SetStateAction<string>>;
  calculateCalories: number | string;
  handleEditModalData: () => void;
  mealName: string | undefined;
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
  mealName,
}) => {

  const [errors, setErrors] = useState<{
    quantity: string;
    selectquantity: string;
    selectCategory: string;
  }>({
    quantity: "",
    selectquantity: "",
    selectCategory: "",
  });
  
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    const newErrors = { ...errors };
  
    // Trigger validation on blur
    if (name === VALIDATION.QUANTITY) {
      newErrors.quantity = validateQuantity(Number(value));
    }
    if (name === VALIDATION.SELECT_QUANTITY) {
      newErrors.selectquantity = validateSelectQuantity(Number(value));
    }
    if (name === VALIDATION.SELECT_CATEGORY) {
      newErrors.selectCategory = validateMealCategory(value);
    }
  
    setErrors(newErrors);
  };
  
  const handleSubmit = useCallback(
    (e: FormEvent): void => {
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
    },
    [quantity, selectquantity, selectCategory, handleEditModalData]
  );

  useEffect(() => {
    if (mealName) {
      setSelectCategory(mealName);
    }
  }, [mealName, setSelectCategory]);

  const sliceOptions = getSliceOptions(selectedFoodData);

  // Fetch image
  const image = getImage(selectedFoodData);

  const foodName = capitalizeFirstLetter(selectedFoodData?.foods[0]?.food_name);
  return (
    <>
      <div>
        <CustomButton
          className="close-button"
          label={LABEL.CLOSE}
          onClick={() => setModal(false)}
        ></CustomButton>

        <h2 className="modal-title" style={{ color: "black" }}>
          {LABEL.UPDATE_MEAL}
        </h2>
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
          {foodName}
        </h3>

        <div className="input-container">
          <label>{LABEL.CHOOSE_QUANTITY}</label>
          <input
            type="number"
            name="quantity"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            onBlur={handleBlur}
            step="1"
          />
          {errors.quantity && (
            <div style={{ color: "red" }}>{errors.quantity}</div>
          )}
        </div>

        <div className="select-container">
          <label>{LABEL.SERVING_SIZE}</label>
          <CustomSelect
            options={sliceOptions}
            value={
              selectquantity
                ? {
                    value: selectquantity,
                    label:
                      sliceOptions.find(
                        (option) => option.value === selectquantity
                      )?.label || "",
                  }
                : null
            }
            onChange={(selectedOption) =>
              setSelectquantity(selectedOption?.value as number)
            }
            onBlur={handleBlur}
          />
          {errors.selectquantity && (
            <div style={{ color: "red" }}>{errors.selectquantity}</div>
          )}
        </div>

        <label className="meal-label">{LABEL.CHOOSE_MEAL}</label>
        <CustomSelect
          options={mealOptions}
          value={
            mealOptions.find((option) => option.value === selectCategory) ||
            null
          }
          onChange={(selectedOption) =>
            setSelectCategory(selectedOption?.value as string)
          }
          onBlur={handleBlur}
        />
        {errors.selectCategory && (
          <div style={{ color: "red" }}>{errors.selectCategory}</div>
        )}

        <p className="calorie-info">
          {LABEL.CALORIE_SERVED} {Math.round(calculateCalories as number)}
        </p>

        <CustomButton
          className="add-meal-button"
          label={LABEL.UPDATE_MEAL}
          onClick={handleSubmit}
        ></CustomButton>
      </div>
    </>
  );
};

export default UpdateMeal;
