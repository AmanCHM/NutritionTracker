import React from "react";
import "./DrinkModal.css";
import { useDispatch } from "react-redux";

import { arrayUnion, doc, setDoc } from "firebase/firestore";

import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { hideLoader, showLoader } from "../../../../Store/Loader";
import {  auth, db } from "../../../../Utils/firebase";
import CustomSelect from "../../../../Components/Shared/CustomSelect/CustomSelect";
import {  CONTAINER_OPTION, DRINK_TYPE, FIREBASE_DOC_REF, QUANTITY_VALIDATION, VALIDATION } from "../../../../Shared/Constants";
import { ERROR_MESSAGES, FORM_VALIDATION_MESSAGES, LABEL, SUCCESS_MESSAGES } from "../../../../Shared";
import CustomButton from "../../../../Components/Shared/CustomButton/CustomButton";
import { dateFunction } from "../../../../Helpers/function";



interface DrinkModalProps {
  setShowDrinkModal: (show: boolean) => void;
  onDataUpdated: () => void;
 
}


interface OptionType {
  value: string;
  label: string;
}

interface FormValues {
  drinkType: string;
  container: string;
  quantity: number;
}

const drinkTypeOptions:OptionType[] = [
  { value: DRINK_TYPE.WATER, label: DRINK_TYPE.WATER },
  { value: DRINK_TYPE.ALCOHOL, label: DRINK_TYPE.ALCOHOL },
  { value: DRINK_TYPE.CAFFEINE, label: DRINK_TYPE.CAFFEINE },
];

const containerOptions :OptionType[] = [
  { value: CONTAINER_OPTION.SMALLGLASS, label:  CONTAINER_OPTION.SMALLGLASS },
  { value: CONTAINER_OPTION.MEDIUMGLASS, label:CONTAINER_OPTION.MEDIUMGLASS },
  { value:  CONTAINER_OPTION.LARGEGLASS, label: CONTAINER_OPTION.LARGEGLASS },
];
const DrinkModal: React.FC<DrinkModalProps> = ({
  setShowDrinkModal,
  onDataUpdated,

}) => {
  const dispatch = useDispatch();

  
  // handle validation and set drink data
  const formik = useFormik<FormValues>({
    initialValues: {
      drinkType: '',
      container: '',
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
        if (user) {
          const userId = user.uid;
          const date = dateFunction;
          const docRef = doc(db, FIREBASE_DOC_REF.USER, userId, FIREBASE_DOC_REF.DAILY_LOGS, date);
          const data = {
            id: Date.now(),
            totalAmount,
            drinklabel: values.container,
          };
          const newData = { [values.drinkType]: arrayUnion(data) };
          await setDoc(docRef, newData, { merge: true });

          if (onDataUpdated) {
            onDataUpdated();
          }
          toast.success(SUCCESS_MESSAGES().SUCCESS_DRINK_ADDED);
        }
      } catch (error) {
        console.error(error);
        toast.error(ERROR_MESSAGES().FAILED_DRINK_ADD);
      } finally {
        setShowDrinkModal(false);
        dispatch(hideLoader());
      }
    },
  });

  return (
    <>
      <CustomButton className="close-button" label={LABEL.CLOSE} onClick={() => setShowDrinkModal(false)}>
                                             
      </CustomButton>
      <h2 className="modal-title" style={{ color: "black" }}>
       
      {LABEL.ADD_DRINK}
      </h2>
      <form onSubmit={formik.handleSubmit}>
       
        <div className="input-group">
          <label htmlFor="drinkType">{LABEL.DRINK_TYPE}</label>
          <CustomSelect
            options={drinkTypeOptions}
            value={drinkTypeOptions?.find((opt) => opt.value === formik.values.drinkType) || null}
            onChange={(selected) => formik.setFieldValue("drinkType", selected?.value || "" ) }
            onBlur={() => formik.setFieldTouched("drinkType", true)}

          />
          {formik.touched.drinkType && formik.errors.drinkType && (
            <p className="error-message">{formik.errors.drinkType}</p>
          )}
        </div>

       
        <div className="input-group">
          <label htmlFor="container">{LABEL.CONTAINER_TYPE}</label>
          <CustomSelect
            options={containerOptions}
            value={containerOptions.find((opt) => opt.value === formik.values.container) ||null}
            onChange={(selected) => formik.setFieldValue("container", selected?.value || "")}
            onBlur={() => formik.setFieldTouched("container", true)}
            
          />
          {formik.touched.container && formik.errors.container && (
            <p className="error-message">{formik.errors.container}</p>
          )}
        </div>

        {/* Quantity */}
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


        <CustomButton
            type="submit" 
            label="Submit"
            variant="primary"
            size="medium"
            style={{ marginLeft: "40%" }}
          />
        </form>
    </>
  );
};

export default DrinkModal;