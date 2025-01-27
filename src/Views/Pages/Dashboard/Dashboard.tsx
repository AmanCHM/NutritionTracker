
import React, { useEffect, useState } from "react";
import Select, { ActionMeta, OnChangeValue, SingleValue } from "react-select";
import "./Dashboard.css";
import {
  arrayUnion,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { Doughnut, Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { FaTrashAlt, FaEdit, FaSearch } from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
;

import Progress from "rsuite/Progress";
import "rsuite/Progress/styles/index.css";
import { Modal, Notification } from "rsuite";
import "rsuite/Notification/styles/index.css";

import { toast } from "react-toastify";
import { useAddMealMutation, useFetchSuggestionsQuery } from "../../../Services/Api/module/foodApi";
import { debounce } from "../../../Helpers/function";
import { hideLoader, showLoader } from "../../../Store/Loader";
import firebaseConfig, {  } from "../../../Utils/firebase";
import { initializeApp } from "firebase/app";
import { string } from "yup";
import { Dispatch } from "@reduxjs/toolkit";
import { IMAGES } from "../../../Shared";
import { isArray } from "lodash";
import DrinkModal from "./Modals/Drink/DrinkModal";
import SetCalorieModal from "./Modals/SetNutrition /SetCalorie";


ChartJS.register(ArcElement, Tooltip, Legend);


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


interface Drink {
  drinklabel: string;
  id: number;
  totalAmount: number;
}


interface MealItem {
  //  id:string ;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  [key: string]:  number;
  servingQuantity: number;
}

interface LogData {
  Breakfast?: MealItem[];
  Lunch?: MealItem[];
  Snack?: MealItem[];
  Dinner?: MealItem[];
  
  }
  


type mealData = MealItem[];



interface CommonFood {
  tag_id: string;
  food_name: string;
}

interface BrandedFood {
  nix_item_id: string;
  brand_name_item_name: string;
  nf_calories: number;
}

interface Suggestions {
  common: CommonFood[];
  branded: BrandedFood[];
}

interface SelectItem {
  label: string;
}

interface Data {
  id: number |string ;
  name: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  serving: string;
  servingQuantity: number;
}


interface OptionType {
  value: string;
  label: string;
}




interface MealId {
  id: string;  
}



interface FoodData {
  foods: { food_name: string }[];
}

interface FoodDetail {
   
  name: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
}


interface LogDataItem {
  id: string | number;
  name: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  serving: string;
  servingQuantity: number;
}



interface Food {
  nf_calories: number;  
    nf_protein: number;  
    nf_total_carbohydrate: number;  
    nf_total_fat: number;  
    serving_weight_grams: number; 
}

interface SelectedFoodData {
  foods: Food[];
}


interface RootState {
  authReducer: {
    logged: boolean;
  };
}
interface DrinkItem{
  totalAmount: number;
}

interface DrinkData {
  Water?: DrinkItem[];
  Alcohol?: DrinkItem[];
  Caffeine?: DrinkItem[];
}


interface ValidDailyCalorie {
  calorie: number | null;
}

const Dashboard = () =>
   
{
 const [inputValue, setInputValue] = useState<string | null>(null);
 const [selectItem, setSelectItem] = useState<string | string[] | undefined>(undefined);
 const [modal, setModal] = useState<boolean>(false);
 const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
 const [quantity, setQuantity] = useState<number>(1);
 const [selectquantity, setSelectquantity] = useState<number>(1);
 const [selectCategory, setSelectCategory] = useState<string>("");
 const [logData, setLogdata] = useState<any>(undefined); 
 const [isloading, setloading] = useState<boolean>(false);
 const [dailyCalorie, setDailyCalorie] = useState<{ calorie: number | null } | null>(null);

 
 const [editModal, setEditModal] = useState<boolean>(false);
 const [selectedId, setSelectedId] = useState<number | string | undefined>(undefined);
 const [editMealName, setEditMealName] = useState<string | undefined>(undefined);
 const [foodMeasure, setFoodMeasure] = useState<string | undefined>(undefined);
 const [showDrinkModal, setShowDrinkModal] = useState<boolean>(false);
 const [drinkUpdateModal, setDrinkUpdateModal] = useState<boolean>(false);
 const [imageData, setImageData] = useState<string | ArrayBuffer | null>(null);
 
 const [drinkData, setDrinkData] = useState<any>(undefined); 
 const [totalWater, setTotalWater] = useState<number | undefined>(undefined);
 const [totalAlcohol, setTotalAlcohol] = useState<number | undefined>(undefined);
 const [totalCaffeine, setTotalCaffeine] = useState<number | undefined>(undefined);
 const [dataUpdated, setDataUpdated] = useState<boolean>(false);
 const [energyModal, setEnergyModal] = useState<boolean>(false);
 const [requiredWater, setRequiredWater] = useState<{ Water: number }>();
 const [requiredAlcohol, setRequiredAlcohol] = useState<{ Alcohol: number }>();
 const [requiredCaffeine, setRequiredCaffeine] = useState<{ Caffeine: number }>();
 const [updateDrinkName, setUpdateDrinkName] = useState<string>('');
 const [editDrinkModal, setEditDrinkModal] = useState<boolean>(false);
 const [drinkId, setDrinkId] = useState<number | string | undefined>(undefined);
 const [drinkName, setDrinkName] = useState<string | undefined>(undefined);
 const [imageModal, setImageModal] = useState<boolean>(false);
 const [altMeasure, setAltMeasure] = useState<string | null>(null);

 const dispatch = useDispatch();

  // const [inputValue, setInputValue] = useState<string>('');

  const debouncedInputValue =  debounce((value: any) => setInputValue(value), 300);

  // Food suggestion search bar
  const {
    data: suggestion  ,
    isLoading,
    isError,
  } = useFetchSuggestionsQuery(inputValue);


  const suggestions = suggestion as Suggestions; 
  const handleSearch = (query: string) => {
    debouncedInputValue(query);
  };


  const groupedOptions = [
    {
      label: "Common Foods",
      options: suggestions?.common.map((element: CommonFood, index: number) => ({
        value: element.tag_id + index,
        label: `${element.food_name}`,
        category: "common",
      })),
    },
    {
      label: "Branded Foods",
      options: suggestions?.branded.map((element: BrandedFood, index: number) => ({
        value: element.nix_item_id + index,
        label: `${element.brand_name_item_name} - ${element.nf_calories} kcal`,
        category: "Branded",
      })),
    },
  ];    
  
  // Fetch Selected food details
  const [addMeal, { data }] = useAddMealMutation();


  const selectedFoodData = data as SelectedFoodData;
   //set selected item by user 
   
   const handleSelect = (newValue: OnChangeValue<OptionType, boolean>, actionMeta: ActionMeta<OptionType>) => {
    // Your implementation here
    const selectedOption = newValue ? (isArray(newValue) ? newValue : [newValue]) : [];

    setSelectItem(selectedOption);
    if (selectedOption.length > 0) {
      addMeal(selectedOption[0]?.label);  
    }
    setModal(true);
  };


  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

 
   const handleModalData = async (
     selectquantity: number | null,
     selectCategory: string | null,
     quantity: number | null,
     selectItem: SelectItem,
     calculateCalories: number,
     protein: number,
     carbs: number,
     fats: number,
     altMeasure: string,
     handleGetData: (user: any) => Promise<void>,
     setModal: (value: boolean) => void,
     setSelectCategory: () => void
   ) => {
     const dispatch = useDispatch();
   
     if (!selectquantity || !selectCategory) {
       toast.error("Please Select all the fields");
       return;
     }
     if (!quantity || quantity <= 0) {
       toast.error("Please Select Quantity");
       return;
     }
     try {
       dispatch(showLoader());
       const user = auth.currentUser;
       const data: Data = {
         id: Date.now(),
         name: selectItem.label,
         calories: Math.round(calculateCalories),
         proteins: Math.round(protein),
         carbs: Math.round(carbs),
         fats: Math.round(fats),
         serving: altMeasure,
         servingQuantity: selectquantity,
       };
       if (user) {
         const userId = user.uid;
         const date = new Date().toISOString().split("T")[0];
         const docRef = doc(db, "users", userId, "dailyLogs", date);
         const categorisedData = { [selectCategory]: arrayUnion(data) };
   
         await setDoc(docRef, categorisedData, { merge: true });
         await handleGetData(user);
   
         toast.success("Food Saved");
         setModal(false);
       }
     } catch (error) {
       toast.error("Error in saving Data");
       console.error("Error saving data:", error);
     } finally {
       dispatch(hideLoader());
       setSelectCategory();
     }
   };

  // Get the Meal details


  const handleGetData = async (user:User):Promise<void> => {
    try {
      dispatch(showLoader());
      if (!user) {
        return;
      }
      const userId = user.uid;

      const date = new Date().toISOString().split("T")[0];

      const docRef = doc(db, "users", userId, "dailyLogs", date);

      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const mealData = docSnap.data();
        setLogdata(mealData);
      } else {
        setLogdata({});
      }
    } catch (error) {
      console.error("error fetching data", error);
    } finally {
      dispatch(hideLoader());
    }
  };

 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user:User | null) => {
         dispatch(showLoader()); 
    if (user) { 
      handleGetData(user).then(() => {
        dispatch(hideLoader());
      });
    } else {
      dispatch(hideLoader()); 
    }
    });
    return () => unsubscribe();
  }, []);


  // delete meal details  from database

  const handleDeleteLog = async (meal: string, id: string) => {
    dispatch(showLoader());
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }
      const userId = user.uid;
      const date = new Date().toISOString().split("T")[0];  
      const docRef = doc(db, "users", userId, "dailyLogs", date);
      const getData = (await getDoc(docRef)).data();
      if (!getData || !getData[meal]) {
        throw new Error("Meal data not found");
      }
      const mealData = getData[meal] as MealId[];  
      const updatedMealData = mealData.filter((mealItem) => mealItem.id !== id);
      await updateDoc(docRef, { [meal]: updatedMealData });
      const updatedDoc = (await getDoc(docRef)).data();
      setLogdata(updatedDoc);  
      toast.success("Item Deleted Successfully");
    } catch (error) {
      console.error(error);
      toast.error("Item not Deleted");
    } finally {
      dispatch(hideLoader());
    }
  };

  
   // set the details of editable item
   const handleEditLog = (
    meal: keyof LogData,
    name: string,
    id: number |string,
    logData: LogData,
    handleGetData: (user: any) => void,
    setSelectedId: (id: number |string) => void,
    setQuantity: (quantity: number) => void,
    setEditMealName: (meal: string) => void,
    setSelectquantity: (quantity: number) => void,
    addMeal: (name: string) => void,
    setEditModal: (value: boolean) => void
  ) => {
    const dispatch = useDispatch();
  
    dispatch(showLoader());
    handleGetData(auth.currentUser);
    setSelectedId(id);
    setQuantity(1);
    setEditMealName(meal);
    
    const selectedLog = logData[meal]?.find((item:MealItem) => item.id === id);
    if (selectedLog) {
      setSelectquantity(selectedLog.servingQuantity);
    }
    
    addMeal(name);
    setEditModal(true);
    dispatch(hideLoader());
  };
 //Edit Meal details



const handleEditModalData = async (
  selectedFoodData: FoodData | null,
  calculateCalories: number,
  protein: number,
  carbs: number,
  fats: number,
  altMeasure: string,
  selectquantity: number,
  editMealName: keyof LogData,
  selectedId: number |string,
  selectCategory: string,
  setLogdata: (data: LogData) => void,
  setEditModal: (value: boolean) => void,
  setSelectCategory: () => void
): Promise<void> => {
  try {
    dispatch(showLoader());
    const user: User | null = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    const userId: string = user.uid;
    const data: LogDataItem = {
      id: Date.now(),
      name: selectedFoodData?.foods[0]?.food_name || '',
      calories: Math.round(calculateCalories),
      proteins: Math.round(protein),
      carbs: Math.round(carbs),
      fats: Math.round(fats),
      serving: altMeasure,
      servingQuantity: selectquantity,
    };
    const date: string = new Date().toISOString().split("T")[0];
    const docRef = doc(db, "users", userId, "dailyLogs", date);
    const getData = (await getDoc(docRef)).data() as LogData;
    const mealdata = getData[editMealName]?.filter(
      (meal:MealItem) => meal.id !== selectedId
    );
    await updateDoc(docRef, { [editMealName]: mealdata });

    const newData = { [selectCategory]: arrayUnion(data) };
    await updateDoc(docRef, newData);
    const updatedDoc = (await getDoc(docRef)).data() as LogData;
    setLogdata(updatedDoc);
  } catch (error) {
    console.log(error);
    toast.error('Something went wrong');
  } finally {
    setEditModal(false);
    dispatch(hideLoader());
    setSelectCategory();
    toast.success('Item edited successfully');
  }
};

// interface drinksdata{
//   water: number;
//   caffeine: number;
//   alcohol: number;
//   calorie: number;
// }

  // Set the required meal and drinks details of user
  const dailyRequiredCalorie = async (
    setRequiredWater:(data :{Water:number})=> void ,
    setRequiredCaffeine:(data:{Caffeine:number})=> void, 
    setRequiredAlcohol:(data:{Alcohol:number})=> void,
    setDailyCalorie:(data:{calorie:number | null})=> void

  ) :Promise<void>=> {
    const currentUser = auth.currentUser;
    const userId = currentUser?.uid;
     
    if (userId) {
      const userDocRef = doc(db, "users", userId);
      try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setRequiredWater(data.water);
          setRequiredCaffeine(data.caffeine);
          setRequiredAlcohol(data.alcohol);
          setDailyCalorie(data.calorie ??null);
        } else {
          setDailyCalorie({calorie:null});
        }
      } catch (error) {
        console.error("Error fetching calorie data:", error);
      } 
    }
  };


  useEffect(() => {
    dailyRequiredCalorie(
      setRequiredWater,
      setRequiredCaffeine,
      setRequiredAlcohol,
      setDailyCalorie
    );
  }, [handleGetData]);



  const calculateNutrient = (
    selectedFoodData: SelectedFoodData,
    nutrient: keyof Food,
    selectquantity: number,
    quantity: number
  ) => {
    return selectedFoodData?.foods?.length > 0
      ? (selectedFoodData?.foods[0][nutrient] /
          selectedFoodData?.foods[0].serving_weight_grams) *
        selectquantity *
        quantity
      : 'no data';
  };
  
 
 
  const calculateCalories = calculateNutrient(
    selectedFoodData,
    "nf_calories",
    selectquantity,
    quantity
  );
  
  const protein = calculateNutrient(
    selectedFoodData,
    "nf_protein",
    selectquantity,
    quantity
  );
  
  const carbs = calculateNutrient(
    selectedFoodData,
    "nf_total_carbohydrate",
    selectquantity,
    quantity
  );
  
  const fats = calculateNutrient(
    selectedFoodData,
    "nf_total_fat",
    selectquantity,
    quantity
  );
  

  
  const calculateMealNutrient = (mealData: mealData, nutrient: string): number => {
    return mealData.length > 0
      ? mealData.reduce((total: number, item: MealItem) => total + (item[nutrient] || 0), 0)
      : 0;
  };
  
  const calculateMealCalories = (mealData: mealData): number => {
    return calculateMealNutrient(mealData, "calories");
  };
  
  const calculateMealProtein = (mealData: mealData): number => {
    return calculateMealNutrient(mealData, "proteins");
  };
  
  const calculateMealCarbs = (mealData: mealData): number => {
    return calculateMealNutrient(mealData, "carbs");
  };
  
  const calculateMealFats = (mealData: mealData): number => {
    return calculateMealNutrient(mealData, "fats");
  };
  
  // // Assuming logData is defined elsewhere in your component
  // const logData: LogData = {
  //   Breakfast: [{ calories: 200, proteins: 10, carbs: 30, fats: 5 }],
  //   Lunch: [{ calories: 400, proteins: 20, carbs: 50, fats: 10 }],
  //   Snack: [{ calories: 100, proteins: 5, carbs: 15, fats: 2 }],
  //   Dinner: [{ calories: 300, proteins: 15, carbs: 40, fats: 8 }],
  // };
  
  const breakfastCalorie = calculateMealCalories(logData?.Breakfast || []);
  const breakfastProtein = calculateMealProtein(logData?.Breakfast || []);
  const breakfastCarbs = calculateMealCarbs(logData?.Breakfast || []);
  const breakfastFats = calculateMealFats(logData?.Breakfast || []);
  
  const lunchCalorie = calculateMealCalories(logData?.Lunch || []);
  const lunchProtein = calculateMealProtein(logData?.Lunch || []);
  const lunchCarbs = calculateMealCarbs(logData?.Lunch || []);
  const lunchFats = calculateMealFats(logData?.Lunch || []);
  
  const snackCalorie = calculateMealCalories(logData?.Snack || []);
  const snackProtein = calculateMealProtein(logData?.Snack || []);
  const snackCarbs = calculateMealCarbs(logData?.Snack || []);
  const snackFats = calculateMealFats(logData?.Snack || []);
  
  const dinnerCalorie = calculateMealCalories(logData?.Dinner || []);
  const dinnerProtein = calculateMealProtein(logData?.Dinner || []);
  const dinnerCarbs = calculateMealCarbs(logData?.Dinner || []);
  const dinnerFats = calculateMealFats(logData?.Dinner || []);


  // Calculate totals for the day
  const totalCalories =
    breakfastCalorie + lunchCalorie + snackCalorie + dinnerCalorie;
  const totalProtein =
    breakfastProtein + lunchProtein + snackProtein + dinnerProtein;
  const totalCarbs = breakfastCarbs + lunchCarbs + snackCarbs + dinnerCarbs;
  const totalFats = breakfastFats + lunchFats + snackFats + dinnerFats;

  const proteinPercent: number = 0.25;
  const carbsPercent: number = 0.5;
  const fatsPercent: number = 0.25;


  
  const calculateNutrients = (dailyCalorie: number) => {
    // Ensure dailyCalorie is not null
    // const validDailyCalorie = dailyCalorie ?? 0;
  
    // Calculate calories
    const proteinCalories: number = dailyCalorie * proteinPercent;
    const carbsCalories: number = dailyCalorie * carbsPercent;
    const fatsCalories: number = dailyCalorie * fatsPercent;
  
    // Convert calories to grams
    const proteinGrams: number = Math.round(proteinCalories / 4);
    const carbsGrams: number = Math.round(carbsCalories / 4);
    const fatsGrams: number = Math.round(fatsCalories / 9);
  
    return {
      proteinGrams,
      carbsGrams,
      fatsGrams,
    };
  };
  
// Safely access `dailyCalorie.calorie` with null checks
const validDailyCalorie = dailyCalorie?.calorie ?? 0;




  const { proteinGrams, carbsGrams, fatsGrams } = calculateNutrients(totalCalories);
  
  const requiredCalorie = validDailyCalorie > 0 ? validDailyCalorie - totalCalories : 0;
  
  const progressPercent: number = dailyCalorie ? Math.floor((totalCalories / validDailyCalorie) * 100) : 0;
  const proteinPercentage: number = Math.floor((totalProtein / proteinGrams) * 100);
  const carbsPercentage: number = Math.floor((totalCarbs / carbsGrams) * 100);
  const fatsPercentage: number = Math.floor((totalFats / fatsGrams) * 100);
  
  // Doughnut Data

  //Doughnut Data

  const doughnutdata = {
    labels: ["Breakfast", "Lunch", "Snack", "Dinner"],
    datasets: [
      {
        data: [breakfastCalorie, lunchCalorie, snackCalorie, dinnerCalorie],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "#afc0d9",
          "#D1C28A",
        ],
      },
    ],
  };

  const getPercentage = (value :number, total:number ) => {
    return ((value / total) * 100).toFixed(2);
  };

  const total = doughnutdata.datasets[0].data.reduce(
    (sum, value) => sum + value,
    0
  );

  const handleNutritionModal = (foodDetail: FoodDetail, id: string): void => {
    addMeal(foodDetail);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  //  Get Drinks 
  const getDrinkData = async (user:User) => {
    try {
      dispatch(showLoader());
      if (!user) {
        return;
      }
      const userId = user.uid;
      const date = new Date().toISOString().split("T")[0];
      const docRef = doc(db, "users", userId, "dailyLogs", date);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const getData = docSnap.data();
        setDrinkData(getData);
      } else {
        setDrinkData({});
      }
    } catch (error) {
      console.error("error in fetching data", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user : User | null) => {
      if (user) {
        getDrinkData(user);
      } else {
        console.log("User not authenticated");
      }
    });
    return () => unsubscribe();
  }, [dataUpdated]);

  const handleDataUpdated = () => {
    setDataUpdated((prev) => !prev);
  };


 //Drinks Calculation
  const calculateTotals = () => {
    const calculateDrinkTotals = (drinkData:DrinkData | undefined) => {
      return isArray(drinkData) && drinkData.length > 0
        ? drinkData.reduce((total :number, drinkItem:DrinkItem) => total + drinkItem.totalAmount, 0)
        : 0;
    };
    setTotalWater(calculateDrinkTotals(drinkData?.Water));
    setTotalAlcohol(calculateDrinkTotals(drinkData?.Alcohol));
    setTotalCaffeine(calculateDrinkTotals(drinkData?.Caffeine));
  };

  // Calculate totals when drinkData changes
  useEffect(() => {
    if (drinkData) {
      calculateTotals();
    }
  }, [drinkData]);


  //energy modal
  const isSignup = useSelector((state: RootState) => state.authReducer.logged);
  useEffect(() => {
    if (isSignup === true) {
      setEnergyModal(true);
      //  dispatch(setSignout())
    }
  }, []);


  
  const handleUpdateDrink = (drinks: Drink): void => {
    setUpdateDrinkName(drinks.drinklabel);
    setDrinkUpdateModal(true);
  };

 


  return (
    <>
      {/* <Navbar /> */}
      <div
        className="search"
        style={{ backgroundImage: `url(${IMAGES.bgSelectImage})` }}
       >
        <h1 id="header-text">Search Your Meals Below</h1>

        <Select
          id="search-box"
          options={groupedOptions}
          onChange={handleSelect}
          onInputChange={handleSearch}
          placeholder="Search here ..."
          className="search-bar"
        />
        <h1 id="header-text">or</h1>
      </div>

      <h2 style={{ padding: "40px" }}>
        AI Food Vision: Identify Your Dish Instantly
      </h2>
      <div className="ai-search">
        <button
          className="ai-search-button"
          onClick={() => {
            setImageModal(true);
          }}
        >
          <span className="ai-search-button-icon">
            <FaSearch size={16} color="white" />
          </span>
          Visual Food Search
        </button>
        <Modal isOpen={imageModal}>
          <ImageSearch
            setImageModal={setImageModal}
            setImageData={setImageData}
            setSelectCategory={setSelectCategory}
            // handelImageSearchModal={handelImageSearchModal}
            handleGetData = {handleGetData}
          ></ImageSearch>
        </Modal>
      </div>

    {/* Energy Modal */}
      <div>
        <Modal isOpen={energyModal}>
          <SetCalorieModal setEnergyModal={setEnergyModal} />
        </Modal>
      </div>

      <Modal isOpen={modal}>
        <MealModal
          modal={modal}
          setModal={setModal}
          quantity={quantity}
          setQuantity={setQuantity}
          selectquantity={selectquantity}
          setSelectquantity={setSelectquantity}
          selectedFoodData={selectedFoodData}
          setSelectCategory={setSelectCategory}
          calculateCalories={calculateCalories}
          selectCategory= {selectCategory}
          handleModalData={handleModalData}
          setFoodMeasure={setFoodMeasure}
          setAltMeasure={setAltMeasure}

        />
      </Modal>


  {/* Meal Table  */}
      <Table
        logData={logData}
        handleNutritionModal={handleNutritionModal}
        handleEditLog={handleEditLog}
        handleDeleteLog={handleDeleteLog}
        showFeature={true}
      />

{/* Meal Progress Line Graph  */}
      <div
        className="progress-line"
        style={{ height: "auto", width: "50vw", marginLeft: "25%" }}
      >
        <h2 style={{ marginTop: "2%", color: "darkgrey", fontSize: "2.0rem" }}>
          Today Meal Progress Report
        </h2>
        <div style={{ margin: "20px 20px" }}>
          <label htmlFor="">
            <strong> Energy : </strong>
            {totalCalories}/{dailyCalorie} kcal
          </label>

          <Progress.Line
            percent={progressPercent}
            status="active"
            strokeColor="#e15f41"
          />
        </div>
        <div style={{ margin: "20px 20px" }}>
          <label htmlFor="">
            <strong> Protein: </strong>
            {totalProtein}/{proteinGrams}g
          </label>
          <Progress.Line
            percent={proteinPercentage}
            status="active"
            strokeColor="#55a630"
          />
        </div>
        <div style={{ margin: "20px 20px" }}>
          <label htmlFor="">
            {" "}
            <strong> Carbs </strong>
            {totalCarbs}/{carbsGrams} g
          </label>
          <Progress.Line
            percent={carbsPercentage}
            status="active"
            strokeColor="355070"
          />
        </div>
        <div style={{ margin: "20px 20px" }}>
          <label htmlFor="">
            {" "}
            <strong> Fat: </strong>
            {totalFats}/{fatsGrams} g
          </label>
          <Progress.Line
            percent={fatsPercentage}
            status="active"
            strokeColor="#52b788"
          />
        </div>
      </div>

  {/* Doughnut Data */}
      <div className="total-calorie">
        <h2 style={{ marginTop: "2%", color: "darkgrey", fontSize: "2.5rem" }}>
          {" "}
          Your Calorie Journey Today
        </h2>
        <div className="doughnut-data">
          <div className="doughnut-graph">
            <Doughnut data={doughnutdata} />
          </div>
          <div className="doughnut-text">
            {doughnutdata.labels.map((label, index) => {
              const value = doughnutdata.datasets[0].data[index];
              const percentage =
                value > 0 ? Math.floor(getPercentage(value, total)) : 0;
              return (
                <div key={index} className="doughnut-text-item">
                  <strong>{label}:</strong> {value} kcal ({percentage}%)
                </div>
              );
            })}
          </div>
        </div>
      </div>

    {/* Update Meal Data  */}
      <Modal isOpen={editModal}>
        <EditDataModal
          setModal={setEditModal}
          quantity={quantity}
          setQuantity={setQuantity}
          mealName={editMealName}
          selectquantity={selectquantity}
          setSelectquantity={setSelectquantity}
          selectedFoodData={selectedFoodData}
          selectCategory= {selectCategory}
          setSelectCategory={setSelectCategory}
          calculateCalories={calculateCalories}
          handleEditModalData={handleEditModalData}
        />
      </Modal>

{/* Nutrition Details */}
      <Modal isOpen={isModalOpen}>
        <NutritionModal
          onClose={handleCloseModal}
          selectedFoodData={selectedFoodData}
          quantity={quantity}
          setQuantity={setQuantity}
          selectquantity={selectquantity}
          setSelectquantity={setSelectquantity}
          setSelectCategory={setSelectCategory}
        
        />
      </Modal>


  {/* Drink Section */}

      <div className="drink-section">
        <h2 style={{ color: "darkgrey", fontSize: "2.5rem" }}>
          Water and Beverages Intake
        </h2>
        <button
          className="ai-search-button"
          onClick={() => setShowDrinkModal(true)}
        >
          Add Drink
          <span className="ai-search-button-icon">
            <FaSearch size={16} color="white" />
          </span>
        </button>

        <Modal isOpen={showDrinkModal}>
          <DrinkModal
            setShowDrinkModal={setShowDrinkModal}
            onDataUpdated={handleDataUpdated}
          />
        </Modal>

        {/* Drinks Table */}
        <div style={{ width: "100%", margin: "20px auto" }}>
          <table
            style={{
              width: "40%",
              borderCollapse: "collapse",
              textAlign: "center",
              fontSize: "1rem",
              color: "#2c3e50",
              marginTop: "10px",
              marginLeft: "30%",
              borderRadius: "2px",
            }}
           >
            <thead>
              <tr style={{ backgroundColor: "#f4f6f7" }}>
                <th
                  style={{
                    padding: "7px",
                    border: "1px solid #ddd",
                    color: "white",
                    backgroundColor: "#aa6f5e",
                    borderRadius: "2px",
                  }}
                >
                  Drink
                </th>
                <th
                  style={{
                    padding: "7px",
                    border: "1px solid #ddd",
                    color: "white",
                    backgroundColor: "#aa6f5e",
                    borderRadius: "2px",
                  }}
                >
                  Total Quantity
                </th>
                <th
                  style={{
                    padding: "7px",
                    border: "1px solid #ddd",
                    color: "white",
                    backgroundColor: "#aa6f5e",
                    borderRadius: "2px",
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                  <img
                    src={Image.water}
                    alt="Water"
                    style={{ height: "60px" }}
                  />
                  <p style={{ margin: "2px 0", fontWeight: "bold" }}>Water</p>
                </td>
                <td style={{ padding: "12x", border: "1px solid #ddd" }}>
                  {totalWater} ml
                </td>
                <td>
                  <div style={{ display: "flex" }}>
                  
                    <span
                      onClick={()=>handleUpdateDrink("Water")}
                      className="icon-button edit"
                    >
                      <FaEdit />
                    </span>
                  </div>
                </td>
              </tr>
              <tr style={{ backgroundColor: "#f9f9f9" }}>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                  <img
                    src={Image.beer}
                    alt="Alcohol"
                    style={{ height: "60px" }}
                  />
                  <p style={{ margin: "2px 0", fontWeight: "bold" }}>Alcohol</p>
                </td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                  {totalAlcohol} ml
                </td>
                <td>
                  <div style={{ display: "flex" }}>
                   
                    <span
                   onClick={()=>handleUpdateDrink("Alcohol")}
                      className="icon-button edit"
                    >
                      <FaEdit />
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                  <img
                    src={Image.coffee}
                    alt="Caffeine"
                    style={{ height: "60px" }}
                  />
                  <p style={{ margin: "2px 0", fontWeight: "bold" }}>
                    Caffeine
                  </p>
                </td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                  {totalCaffeine} ml
                </td>
                <td>
                  <div style={{ display: "flex" }}>
                  
                    <span
                      onClick={()=>handleUpdateDrink("Caffeine")}
                      className="icon-button edit"
                    >
                      <FaEdit />
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <Modal isOpen={drinkUpdateModal}>
          <UpdateDrinkModal
            setDrinkUpdateModal={setDrinkUpdateModal}
            onDataUpdated={handleDataUpdated}
            updateDrinkName = {updateDrinkName}
            editDrinkModal={editDrinkModal}
            setEditDrinkModal={setEditDrinkModal}
            setDrinkId = {setDrinkId}
            setDrinkName={setDrinkName}
          />
        </Modal>

        <Modal isOpen={editDrinkModal}>
          <EditDrinkModal
           setEditDrinkModal={setEditDrinkModal}
            onDataUpdated={handleDataUpdated}
            drinkName={drinkName}
            drinkId={drinkId}
          />
         </Modal>


          {/* Water Progress Line Graph   */}
          <div
            className="progress-line"
            style={{ height: "auto", width: "50vw", marginLeft: "25%" }}
          >
            <h2
              style={{ marginTop: "2%", color: "darkgrey", fontSize: "2.0rem" }}
            >
              Today's Drink Progress Report
            </h2>

            <div style={{ margin: "20px 20px" }}>
              <label htmlFor="">
                <strong> Water : </strong>
                {totalWater}/{requiredWater} ml
              </label>
              <Progress.Line
                percent={totalWater>0 ? Math.floor((totalWater / requiredWater) * 100):0}
                status="active"
                strokeColor="#e15f41"
              />
            </div>
            <div style={{ margin: "20px 20px" }}>
              <label htmlFor="">
                <strong> Alcohol: </strong>
                {totalAlcohol}/{requiredAlcohol}ml
              </label>
              <Progress.Line
                percent={totalAlcohol>0 ? Math.floor((totalAlcohol / requiredAlcohol) * 100):0}
                status="active"
                strokeColor="#55a630"
              />
            </div>
            <div style={{ margin: "20px 20px" }}>
              <label htmlFor="">
                {" "}
                <strong> Caffeine: </strong>
                {totalCaffeine}/{requiredCaffeine} ml
              </label>
              <Progress.Line
                percent={totalCaffeine >0 ?Math.floor((totalCaffeine / requiredCaffeine) * 100):0}
                status="active"
                strokeColor="355070"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer className="footer" />
    </>
  );
};

export default Dashboard;