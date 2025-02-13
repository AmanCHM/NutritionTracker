import React, { useCallback, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";

import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { hideLoader, showLoader } from "../../../../Store/Loader";
import { auth, db } from "../../../../Utils/firebase";
import { ERROR_MESSAGES, LABEL, SUCCESS_MESSAGES } from "../../../../Shared";
import { FIREBASE_DOC_REF } from "../../../../Shared/Constants";
import { dateFunction } from "../../../../Helpers/function";
import CustomButton from "../../../../Components/Shared/CustomButton/CustomButton";


interface UpdateDrinkModalProps {
  setDrinkUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
  updateDrinkName: string;
  onDataUpdated: () => void;
  setEditDrinkModal: React.Dispatch<React.SetStateAction<boolean>>;
  editDrinkModal: boolean;
  setDrinkId: React.Dispatch<React.SetStateAction<string | number | undefined>>;
  setDrinkName: React.Dispatch<React.SetStateAction<string | ''>>;
  drinkDetails:DrinkDetails
}

interface DrinkDetails {
  [key: string]: {
    drinklabel: string;
    totalAmount: number;
    id: string;
  }[];
}

const UpdateDrinkModal: React.FC<UpdateDrinkModalProps> = ({
  setDrinkUpdateModal,
  updateDrinkName,
  onDataUpdated,
  setEditDrinkModal,
  editDrinkModal,
  setDrinkId,
  setDrinkName,
  drinkDetails,
}) => {
 
  const [drinkData, setDrinkData] = useState<DrinkDetails | undefined>();
  const [drinkId, setUpdateId] = useState<string | undefined>();
  const dispatch = useDispatch();

  // Delete the drink

  const handleDeleteDrink = useCallback(async (drinkType: string, id: string) => {
    dispatch(showLoader());
    try {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const date = dateFunction;
        const docRef = doc(db, FIREBASE_DOC_REF.USER, userId, FIREBASE_DOC_REF.DAILY_LOGS, date);
        const getData = (await getDoc(docRef)).data();
        if (getData) {
          const drinkData = getData[drinkType].filter((drink: { id: string }) => drink.id !== id);
          await updateDoc(docRef, { [drinkType]: drinkData });
          const updatedDoc = (await getDoc(docRef)).data();
          setDrinkData(updatedDoc);
          if (onDataUpdated) {
            onDataUpdated();
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(hideLoader());
      toast.success(SUCCESS_MESSAGES().SUCCESS_ITEM_DELETED);
    }
  }, [dispatch, onDataUpdated]);
  
  const handleEditModal = useCallback((drinkType: string, id: string) => {
    setDrinkName(drinkType);
    setDrinkId(id);
    setEditDrinkModal(true);
    setUpdateId(id);
    setDrinkUpdateModal(false);
  }, []);
  


 


  return (
    <>
      <CustomButton
        className="close-button"
        label={LABEL.CLOSE}
        onClick={() => setDrinkUpdateModal(false)}
      ></CustomButton>

      <h2 className="modal-title" style={{ color: "black" }}>
        {LABEL.UPDATE} {updateDrinkName} {LABEL.DETAILS}
      </h2>

      <div>
        <table className="meal-table">
          <thead>
            <tr>
              <th>{LABEL.DRINK_SIZE}</th>
              <th>{LABEL.DRINK_QUANTITY}</th>
              <th>{LABEL.ACTION}</th>
            </tr>
          </thead>
          <tbody>
            {(drinkDetails?.[updateDrinkName]?.length ?? 0) > 0 ? (
              drinkDetails?.[updateDrinkName]?.map((item, index) => (
                <tr key={`drink-${index}`}>
                  <td>{item.drinklabel}</td>
                  <td>{item.totalAmount}</td>
                  <td>
                    <div style={{ display: "flex" }}>
                      <span
                        onClick={() =>
                          handleDeleteDrink(updateDrinkName, item.id)
                        }
                        className="icon-button delete"
                      >
                        <FaTrashAlt style={{ color: "#e15f41" }} />
                      </span>
                      <span
                        onClick={() =>
                          handleEditModal(updateDrinkName, item.id)
                        }
                        className="icon-button edit"
                      >
                        <FaEdit />
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>{LABEL.NO_ITEM_AVAILABLE}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UpdateDrinkModal;
