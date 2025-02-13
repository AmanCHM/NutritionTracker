import React, {
  useState,
  ChangeEvent,
  FocusEvent,
  FormEvent,
  useMemo,
} from "react";
import CustomSelect, {
  OptionType,
} from "../../../../Components/Shared/CustomSelect/CustomSelect";
import { SelectedFoodData } from "../../Dashboard";
import { User } from "firebase/auth";
import { MEALTYPE, VALIDATION, mealOptions } from "../../../../Shared/Constants";
import { FORM_VALIDATION_MESSAGES, LABEL } from "../../../../Shared";
import { capitalizeFirstLetter, getImage, getSliceOptions,  validateMealCategory, validateQuantity, validateSelectQuantity } from "../../../../Helpers/function";
import CustomButton from "../../../../Components/Shared/CustomButton/CustomButton";

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

const sliceOptions = getSliceOptions(selectedFoodData);
 
  // Fetch image
  const image = getImage(selectedFoodData)

 
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

  const foodName = capitalizeFirstLetter(selectedFoodData?.foods[0]?.food_name);

  const altMeasures =
    selectedFoodData?.foods?.flatMap((food) => food.alt_measures) || [];

  return (
    <>
      <div>
        <CustomButton
          className="close-button"
          label={LABEL.CLOSE}
          onClick={() => setModal(false)}
        ></CustomButton>
        <h2>{LABEL.SELECT_MEAL}</h2>
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
          <label>{LABEL.SERVING_SIZE}</label>
          <CustomSelect
            placeholder="Choose a meal"
            options={sliceOptions}
            value={
              selectquantity
                ? {
                    value: selectquantity,
                    label:
                      altMeasures.find(
                        (measure) => measure.serving_weight === selectquantity
                      )?.measure || "No label",
                  }
                : null
            }
            onChange={(selectedOption) => {
              const selectedMeasure = altMeasures.find(
                (measure) => measure.serving_weight === selectedOption?.value
              );

              setSelectquantity(selectedOption?.value as number);

              setAltMeasure(selectedMeasure?.measure || "");
            }}
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
          label={LABEL.ADD_MEAL}
          onClick={handleSubmit}
        ></CustomButton>
      </div>
    </>
  );
};

export default MealModal;
