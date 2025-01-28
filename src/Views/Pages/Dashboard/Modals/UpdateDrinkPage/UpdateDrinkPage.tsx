import React from "react";

import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";

import { useDispatch } from "react-redux";

import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { hideLoader, showLoader } from "../../../../../Store/Loader";
import { auth, db } from "../../../../../Utils/firebase";
import CustomSelect from "../../../../../Components/Shared/CustomSelect/CustomSelect";

// Define the types for the component props
interface UpdateMealProps {
  setEditDrinkModal: React.Dispatch<React.SetStateAction<boolean>>;
  drinkName: string  ; 
  drinkId: string |number |undefined;
  onDataUpdated: () => void;
}

const UpdateDrinkPage: React.FC<UpdateMealProps> = ({ setEditDrinkModal, drinkName, drinkId, onDataUpdated }) => {
  const dispatch = useDispatch();

  const drinkTypeOptions = [
    { value: "Water", label: "Water" },
    { value: "Alcohol", label: "Alcohol" },
    { value: "Caffeine", label: "Caffeine" },
  ];

  const containerOptions = [
    { value: "Small Glass (100ml)", label: "Small Glass (100ml)" },
    { value: "Medium Glass (175ml)", label: "Medium Glass (175ml)" },
    { value: "Large Glass (250ml)", label: "Large Glass (250ml)" },
  ];

  //  Edit drink details 
  const formik = useFormik({
    initialValues: {
      drinkType: drinkName,
      container: "",
      quantity: 1,
    },
    validationSchema: Yup.object({
      drinkType: Yup.string().required("Please select a drink type."),
      container: Yup.string().required("Please select a container type."),
      quantity: Yup.number()
        .required("Please enter a quantity.")
        .positive("Quantity must be a positive number.")
        .integer("Quantity must be a whole number."),
    }),
    onSubmit: async (values) => {
      const servingSize =
        values.container === "Small Glass (100ml)"
          ? 100
          : values.container === "Medium Glass (175ml)"
          ? 175
          : 250;

      const totalAmount = servingSize * values.quantity;

      dispatch(showLoader());
      try {
        const user = auth.currentUser;
        if (!user) {
          throw new Error("User is not authenticated");
        }
        const userId = user.uid;
        const date = new Date().toISOString().split("T")[0];
        const docRef = doc(db, "users", userId, "dailyLogs", date);

        const existingData = (await getDoc(docRef)).data();
        if (!existingData || !existingData[drinkName]) {
          throw new Error("No data found for the specified drink type.");
        }

        const updatedDrinkData = existingData[drinkName].filter(
          (item: { id: string }) => item.id !== drinkId
        );

        // Remove old drink data
        await updateDoc(docRef, { [drinkName]: updatedDrinkData });

        // Add updated drink data
        const newDrinkData = {
          id: Date.now().toString(),
          totalAmount,
          drinklabel: values.container,
        };
        const newData = { [values.drinkType]: arrayUnion(newDrinkData) };
        await updateDoc(docRef, newData);

        if (onDataUpdated) onDataUpdated();

        toast.success("Drink details updated successfully!");
      } catch (error) {
        console.error(error);
        toast.error("Failed to update drink details.");
      } finally {
        setEditDrinkModal(false);
        dispatch(hideLoader());
      }
    },
  });

  return (
    <>
      <button className="close-button" onClick={() => setEditDrinkModal(false)}>
        X
      </button>
      <h2 className="modal-title" style={{ color: "black" }}>
        Update Drink Details
      </h2>

      <form onSubmit={formik.handleSubmit}>
    
        <div className="input-group">
          <label htmlFor="drinkType">Drink Type:</label>
          <CustomSelect
            options={drinkTypeOptions}
            value={drinkTypeOptions.find((opt) => opt.value === formik.values.drinkType)||null}
            onChange={(selected) => formik.setFieldValue("drinkType", selected?.value || "")}
            onBlur={() => formik.setFieldTouched("drinkType", true)}
            placeholder="Select a drink type"
          />
          {formik.touched.drinkType && formik.errors.drinkType && (
            <p className="error-message">{formik.errors.drinkType}</p>
          )}
        </div>

        
        <div className="input-group">
          <label htmlFor="container">Container Type:</label>
          <CustomSelect
            options={containerOptions}
            value={containerOptions.find((opt) => opt.value === formik.values.container)||null}
            onChange={(selected) => formik.setFieldValue("container", selected?.value || "")}
            onBlur={() => formik.setFieldTouched("container", true)}
            placeholder="Select a container type"
          />
          {formik.touched.container && formik.errors.container && (
            <p className="error-message">{formik.errors.container}</p>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            min="1"
            value={formik.values.quantity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter quantity"
          />
          {formik.touched.quantity && formik.errors.quantity && (
            <p className="error-message">{formik.errors.quantity}</p>
          )}
        </div>

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </>
  );
};

export default UpdateDrinkPage;