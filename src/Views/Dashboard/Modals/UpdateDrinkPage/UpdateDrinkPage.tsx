import React from "react";

import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";

import { useDispatch } from "react-redux";

import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { hideLoader, showLoader } from "../../../../Store/Loader";
import { auth, db } from "../../../../Utils/firebase";
import CustomSelect from "../../../../Components/Shared/CustomSelect/CustomSelect";
import { CONTAINER_OPTION, DRINK_TYPE, FIREBASE_DOC_REF, QUANTITY_VALIDATION, VALIDATION } from "../../../../Shared/Constants";
import { ERROR_MESSAGES, FORM_VALIDATION_MESSAGES, LABEL, SUCCESS_MESSAGES } from "../../../../Shared";
import { dateFunction } from "../../../../Helpers/function";

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
    { value: DRINK_TYPE.WATER, label: DRINK_TYPE.WATER },
    { value: DRINK_TYPE.ALCOHOL, label: DRINK_TYPE.ALCOHOL },
    { value: DRINK_TYPE.CAFFEINE, label: DRINK_TYPE.CAFFEINE },
  ];

  const containerOptions = [
    { value: CONTAINER_OPTION.SMALLGLASS, label:  CONTAINER_OPTION.SMALLGLASS },
    { value: CONTAINER_OPTION.MEDIUMGLASS, label:CONTAINER_OPTION.MEDIUMGLASS },
    { value:  CONTAINER_OPTION.LARGEGLASS, label: CONTAINER_OPTION.LARGEGLASS },
  ];

  //  Edit drink details 
  const formik = useFormik({
    initialValues: {
      drinkType: drinkName,
      container: "",
      quantity: 1,
    },
    validationSchema: Yup.object({
      drinkType: Yup.string().required(FORM_VALIDATION_MESSAGES().DRINK_SELECTOR),
      container: Yup.string().required(FORM_VALIDATION_MESSAGES().CONTAINER_SELECT),
      quantity: Yup.number()
      .required(QUANTITY_VALIDATION.REQUIRED)
    .positive(QUANTITY_VALIDATION.POSITIVE)
    .integer(QUANTITY_VALIDATION.INTEGER)
    .typeError(QUANTITY_VALIDATION.NUMBER),
   
    }),
    onSubmit: async (values) => {
      const servingSize =
      values.container === CONTAINER_OPTION.SMALLGLASS
      ? CONTAINER_OPTION.SMALL_QUANTITY
      : values.container === CONTAINER_OPTION.MEDIUMGLASS
      ? CONTAINER_OPTION.MEDIUM_QUANTITY
      :CONTAINER_OPTION.LARGE_QUANTITY;

      const totalAmount = servingSize * values.quantity;

      dispatch(showLoader());
      try {
        const user = auth.currentUser;
        if (!user) {
          throw new Error(ERROR_MESSAGES().USER_NOT_AUTHENTICATED);
        }
        const userId = user.uid;
        const date = dateFunction;
        const docRef = doc(db, FIREBASE_DOC_REF.USER, userId, FIREBASE_DOC_REF.DAILY_LOGS, date);

        const existingData = (await getDoc(docRef)).data();
        if (!existingData || !existingData[drinkName]) {
          throw new Error(ERROR_MESSAGES().NOT_FOUND);
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

        toast.success(SUCCESS_MESSAGES().SUCCESS_DRINK_ADDED);
      } catch (error) {
        console.error(error);
        toast.error(ERROR_MESSAGES().FAILED_DRINK_ADD);
      } finally {
        setEditDrinkModal(false);
        dispatch(hideLoader());
      }
    },
  });

  return (
    <>
      <button className="close-button" onClick={() => setEditDrinkModal(false)}>
      {LABEL.CLOSE}
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
            placeholder={VALIDATION.SELECT_DRINK_TYPE}
          />
          {formik.touched.drinkType && formik.errors.drinkType && (
            <p className="error-message">{formik.errors.drinkType}</p>
          )}
        </div>

        
        <div className="input-group">
          <label htmlFor="container">{LABEL.CONTAINER_TYPE}C</label>
          <CustomSelect
            options={containerOptions}
            value={containerOptions.find((opt) => opt.value === formik.values.container)||null}
            onChange={(selected) => formik.setFieldValue("container", selected?.value || "")}
            onBlur={() => formik.setFieldTouched("container", true)}
            placeholder={VALIDATION.SELECT_CONTAINER}
          />
          {formik.touched.container && formik.errors.container && (
            <p className="error-message">{formik.errors.container}</p>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="quantity">{LABEL.QUANTITY}</label>
          <input
            type="number"
            id="quantity"
            min="1"
            value={formik.values.quantity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={VALIDATION.ENTER_QUANTITY}
          />
          {formik.touched.quantity && formik.errors.quantity && (
            <p className="error-message">{formik.errors.quantity}</p>
          )}
        </div>

        <button type="submit" className="submit-button">
          {LABEL.SUBMIT}
        </button>
      </form>
    </>
  );
};

export default UpdateDrinkPage;