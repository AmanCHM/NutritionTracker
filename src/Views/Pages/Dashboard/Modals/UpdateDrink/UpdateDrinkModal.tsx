import React, { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";

import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { hideLoader, showLoader } from "../../../../../Store/Loader";
import { auth, db } from "../../../../../Utils/firebase";

// Define types for props
interface UpdateDrinkModalProps {
  setDrinkUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
  updateDrinkName: string;
  onDataUpdated: () => void;
  setEditDrinkModal: React.Dispatch<React.SetStateAction<boolean>>;
  editDrinkModal: boolean;
  setDrinkId: React.Dispatch<React.SetStateAction<string | number |undefined>>;
  setDrinkName: React.Dispatch<React.SetStateAction<string |undefined>>;
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
}) => {
  const [drinkDetails, setDrinkDetails] = useState<DrinkDetails | undefined>();
  const [drinkData, setDrinkData] = useState<DrinkDetails | undefined>();
  const [drinkId, setUpdateId] = useState<string | undefined>();
  const dispatch = useDispatch();

  // Delete the drink
  const handleDeleteDrink = async (drinkType: string, id: string) => {
    dispatch(showLoader());
    try {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const date = new Date().toISOString().split("T")[0];
        const docRef = doc(db, "users", userId, "dailyLogs", date);
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
      toast.success("Successfully item deleted");
    }
  };

  // Set the details of editable drink
  const handleEditModal = (drinkType: string, id: string) => {
    setDrinkName(drinkType);
    setDrinkId(id);
    setEditDrinkModal(true);
    setUpdateId(id);
    setDrinkUpdateModal(false);
  };

  // Get the drink data
  const getDrinkData = async (user: User | null) => {
    try {
      dispatch(showLoader());
      if (user) {
        const userId = user.uid;
        const date = new Date().toISOString().split("T")[0];
        const docRef = doc(db, "users", userId, "dailyLogs", date);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const getData = docSnap.data();
          setDrinkDetails(getData);
        } else {
          setDrinkDetails({});
        }
      }
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      getDrinkData(user);
    });
    return () => unsubscribe();
  }, [drinkData]);

  return (
    <>
      <button className="close-button" onClick={() => setDrinkUpdateModal(false)}>
        X
      </button>

      <h2 className="modal-title" style={{ color: "black" }}>
        Update {updateDrinkName} Details
      </h2>

      <div>
        <table className="meal-table">
          <thead>
            <tr>
              <th>Drink Size</th>
              <th>Drink Quantity (ml)</th>
              <th>Action</th>
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
                        onClick={() => handleDeleteDrink(updateDrinkName, item.id)}
                        className="icon-button delete"
                      >
                        <FaTrashAlt style={{ color: "#e15f41" }} />
                      </span>
                      <span
                        onClick={() => handleEditModal(updateDrinkName, item.id)}
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
                <td colSpan={3}>No items available</td>
              </tr>
            ) }
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UpdateDrinkModal;
