import React, { useEffect, useRef, useState } from "react";
import "./ImageSearch.css";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";

import { toast } from "react-toastify";

import { arrayUnion, doc, setDoc } from "firebase/firestore";
import { useFormik } from "formik";
import * as Yup from "yup";
import { hideLoader, showLoader } from "../../../../Store/Loader";
import { auth, db } from "../../../../Utils/firebase";
import CustomSelect from "../../../../Components/Shared/CustomSelect/CustomSelect";
import { Throttle } from "../../../../Helpers/function";
import {
  FIREBASE_DOC_REF,
  IMAGE_ID_API_URL,
  MEALTYPE,
  NUTRIENT,
  NUTRI_INFO_API_URL,
  VALIDATION,
} from "../../../../Shared/Constants";
import {
  ERROR_MESSAGES,
  FORM,
  FORM_VALIDATION_MESSAGES,
  LABEL,
  SUCCESS_MESSAGES,
} from "../../../../Shared";
import { TABLE_STYLE } from "../../../../assets/Css/customStyle";

interface ImageSearchProps {
  setImageModal: (show: boolean) => void;
  setImageData: (data: any) => void;
  handleGetData: (user: any) => void;
 
}

interface NutritionInfo {
  foodName: string[];
  nutritional_info: {
    calories: number;
    totalNutrients: {
      CHOCDF: { quantity: number };
      FAT: { quantity: number };
      PROCNT: { quantity: number };
    };
  };
}

const ImageSearch: React.FC<ImageSearchProps> = ({
  setImageModal,
  setImageData,
  handleGetData,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [mealCategory, setMealCategory] = useState<string | undefined>();
  const dispatch = useDispatch();
  const [name, setName] = useState<string>("");
  const [calories, setCalories] = useState<number>(0);
  const [carbohydrates, setCarbohydrates] = useState<number>(0);
  const [fat, setFat] = useState<number>(0);
  const [protein, setProtein] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageId, setImageId] = useState<string | null>(null);
  const [nutritionInfo, setNutritionInfo] = useState<
    NutritionInfo | undefined
  >();

  const [errors, setErrors] = useState<{
    quantity: string;
    mealCategory: string;
  }>({
    quantity: "",
    mealCategory: "",
  });

  // Validate Quantity
  const validateQuantity = (value: number): string => {
    if (!value || value <= 0) {
      return FORM_VALIDATION_MESSAGES().VALID_QUANTITY;
    }
    return "";
  };

  // Validate Meal Category
  const validateMealCategory = (value: string | undefined): string => {
    if (!value) {
      return FORM_VALIDATION_MESSAGES().CHOOSE_MEAL_CATEGORY;
    }
    return "";
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    const newErrors = { ...errors };

    // Trigger validation on blur
    if (name === VALIDATION.QUANTITY) {
      newErrors.quantity = validateQuantity(Number(value));
    }

    if (name === VALIDATION.SELECT_CATEGORY) {
      newErrors.mealCategory = validateMealCategory(value);
    }

    setErrors(newErrors);
  };

  // Save the meal details into Firebase
  const handleSaveData = (e: React.FormEvent): void => {
    e.preventDefault();

    dispatch(showLoader());

    const newErrors = {
      quantity: validateQuantity(quantity),
      mealCategory: validateMealCategory(mealCategory),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => !error)) {
      const newData = {
        id: Date.now(),
        name: name,
        calories: calories,
        proteins: protein,
        carbs: carbohydrates,
        fats: fat,
      };
      setImageData(newData);
      handelImageSearchModal(newData);

      dispatch(hideLoader());
      toast.success(SUCCESS_MESSAGES().SUCCESS_ITEM_DELETED);
    } else {
      dispatch(hideLoader());
    }
  };

  const throttledHandleSaveData = Throttle((e: React.FormEvent) => {
    handleSaveData(e);
  }, 1000);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file: File | undefined = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
    setSelectedFile(file ?? null);
  };

  // Set the meal details
  const handelImageSearchModal = async (data: any): Promise<void> => {
    dispatch(showLoader());
    try {
      const user = auth.currentUser;
      if (user) {
        const userId = user?.uid;
        const date = new Date().toISOString().split("T")[0];
        const docRef = doc(
          db,
          FIREBASE_DOC_REF.USER,
          userId,
          FIREBASE_DOC_REF.DAILY_LOGS,
          date
        );
        const categorisedData = { [mealCategory as string]: arrayUnion(data) };

        await setDoc(docRef, categorisedData, { merge: true });
        handleGetData(user);

        setImageModal(false);
      }
    } catch (error) {
      console.error(ERROR_MESSAGES().ERROR_SAVING_DATA, error);
    } finally {
      dispatch(hideLoader());
    }
  };

  // ImageID API
  const handleUpload = async (): Promise<void> => {
    setImageData(null);
    dispatch(showLoader());
    const formData = new FormData();
    if (selectedFile) {
      formData.append("image", selectedFile);
    }
    try {
      const result = await axios.post(`${IMAGE_ID_API_URL}`, formData, {
        headers: {
          Authorization: import.meta.env.VITE_LOGMEAL_API_TOKEN,
          "Content-Type": "multipart/form-data",
        },
      });

      setImageId(result.data?.imageId);
    } catch (error) {
      toast.error(ERROR_MESSAGES().UPLOAD_FOOD_IMAGE);
      console.log(error);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    if (imageId) {
      fetchNutritionInfo(imageId);
    }
  }, [imageId]);

  // Nutrition info API
  const fetchNutritionInfo = async (imageId: string): Promise<void> => {
    const data = { imageId: imageId };
    try {
      const result = await axios.post(`${NUTRI_INFO_API_URL}`, data, {
        headers: {
          Authorization: import.meta.env.VITE_LOGMEAL_API_TOKEN,
          "Content-Type": "application/json",
        },
      });
      setNutritionInfo(result.data);
    } catch (error) {
      toast.error(ERROR_MESSAGES().UPLOAD_FOOD_IMAGE);
      console.log(error);
    }
  };

  useEffect(() => {
    if (nutritionInfo) {
      setName(nutritionInfo?.foodName[0] || "");
      setCalories(
        Math.floor(nutritionInfo?.nutritional_info?.calories) * quantity || 0
      );
      setCarbohydrates(
        Math.floor(
          nutritionInfo?.nutritional_info?.totalNutrients?.CHOCDF?.quantity
        ) * quantity || 0
      );
      setFat(
        Math.floor(
          nutritionInfo?.nutritional_info?.totalNutrients?.FAT?.quantity
        ) * quantity || 0
      );
      setProtein(
        Math.floor(
          nutritionInfo?.nutritional_info?.totalNutrients?.PROCNT?.quantity
        ) * quantity || 0
      );
    }
  }, [nutritionInfo, quantity]);

  const mealOptions = [
    { value: MEALTYPE.BREAKFAST, label: MEALTYPE.BREAKFAST },
    { value: MEALTYPE.LUNCH, label: MEALTYPE.LUNCH },
    { value: MEALTYPE.SNACK, label: MEALTYPE.SNACK },
    { value: MEALTYPE.DINNER, label: MEALTYPE.DINNER },
  ];

  return (
    <>
      <span
        className="close-button"
        onClick={() => setImageModal(false)}
        style={{
          color: "black",
          backgroundColor: "white",
          padding: "5px",
          cursor: "pointer",
        }}
      >
        {LABEL.CLOSE}
      </span>

      <div className="image-search-container">
        <h2 className="title"> {LABEL.RECO_FOOD}</h2>

        <div className="upload-section">
          <input
            type="file"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>

        {imageSrc && (
          <div className="image-preview">
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Uploaded Preview"
              className="preview-image"
            />
          </div>
        )}

        <button onClick={handleUpload} className="upload-button">
          {LABEL.UPLOAD}
        </button>

        {nutritionInfo && (
          <div>
            <h2>{LABEL.NUTRI_INFO}</h2>
            <h3>{name}</h3>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "20px",
                fontSize: "1rem",
                color: "#2c3e50",
                textAlign: "left",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f4f6f7" }}>
                  <th style={TABLE_STYLE}>{LABEL.NUTRIENT}</th>
                  <th style={TABLE_STYLE}>{LABEL.QUANTITY}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TABLE_STYLE}>{NUTRIENT.CALORIE}</td>
                  <td style={TABLE_STYLE}>
                    {calories} {FORM.KCAL}
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#f9f9f9" }}>
                  <td style={TABLE_STYLE}>{NUTRIENT.CARBS}</td>
                  <td style={TABLE_STYLE}>
                    {carbohydrates} {FORM.GM}
                  </td>
                </tr>
                <tr>
                  <td style={TABLE_STYLE}>{NUTRIENT.FATS}</td>
                  <td style={TABLE_STYLE}>
                    {fat} {FORM.GM}
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#f9f9f9" }}>
                  <td style={TABLE_STYLE}>{NUTRIENT.PROTEIN}</td>
                  <td style={TABLE_STYLE}>
                    {protein} {FORM.GM}
                  </td>
                </tr>
              </tbody>
            </table>
            <div style={{ marginTop: "30px" }}>
              <label className="meal-label">{LABEL.CHOOSE_MEAL}</label>
              <CustomSelect
                options={mealOptions}
                value={
                  mealOptions.find((option) => option.value === mealCategory) ||
                  null
                }
                onChange={(selected) =>
                  setMealCategory(selected?.value as string)
                }
                // onBlur={ handleBlur}
              />
              {errors.mealCategory && (
                <div style={{ color: "red" }}>{errors.mealCategory}</div>
              )}
            </div>

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

            <div>
              <p className="calorie-info">
                {LABEL.CALORIE_SERVED}
                {calories || "N/A"}
              </p>
              <button
                className="add-meal-button"
                onClick={throttledHandleSaveData}
              >
                {LABEL.ADD_MEAL}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ImageSearch;
