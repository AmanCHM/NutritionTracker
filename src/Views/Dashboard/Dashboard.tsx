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
import Progress from "rsuite/Progress";
import "rsuite/Progress/styles/index.css";
import { Modal, Notification } from "rsuite";
import "rsuite/Notification/styles/index.css";

import { toast } from "react-toastify";
import {
  useAddMealMutation,
  useFetchSuggestionsQuery,
} from "../../Services/Api/module/foodApi";
import { debounce } from "../../Helpers/function";
import { hideLoader, showLoader } from "../../Store/Loader";
import firebaseConfig, { auth, db } from "../../Utils/firebase";
import { initializeApp } from "firebase/app";
import { string } from "yup";
import { Dispatch } from "@reduxjs/toolkit";
import { ERROR_MESSAGES, FORM, FORM_VALIDATION_MESSAGES, IMAGES, LABEL, SUCCESS_MESSAGES } from "../../Shared";
import { isArray } from "lodash";
import DrinkModal from "./Modals/Drink/DrinkModal";

import CustomModal from "../../Components/Shared/CustomModal/CustomModal";
import ImageSearch from "./Modals/ImageSearch/ImageSearch";
import MealModal from "./Modals/Meal/MealModal";
import Table from "../../Components/Shared/Table/Table";
import UpdateMeal from "./Modals/UpdateMeal/UpdateMeal";
import NutritionModal from "./Modals/Nutrition/NutritionModal";
import UpdateDrinkModal from "./Modals/UpdateDrink/UpdateDrinkModal";
import UpdateDrinkPage from "./Modals/UpdateDrinkPage/UpdateDrinkPage";
import DrinkProgress from "./Components/DrinkProgress/DrinkProgress";
import { RootState } from "../../Store";
import MealProgress from "./Components/MealProgress/MealProgress";
import SetCalorieModal from "./Modals/SetNutrition /SetCalorie";
import { setSignout } from "../../Store/Auth";
import { DRINK_TYPE, FIREBASE_DOC_REF, GROUP_OPTIONS, MEALTYPE, NUTRIENT, VALIDATION } from "../../Shared/Constants";
import { DRINK_TABLE_STYLE } from "../../assets/Css/customStyle";
// import SetCalorieModal from "./Modals/SetNutrition/SetCalorie";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Drink {
  drinklabel: string;
  id?: number;
  totalAmount?: number;
}

export interface MealItem {
  id: string;
  name: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  [key: string]: string | number;
  servingQuantity: number;
}

export interface LogData {
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
  id: number | string;
  name: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  serving: string |null;
  servingQuantity: number;
}

interface OptionType {
  value: string;
  label: string;
}

interface MealId {
  id: string;
}

export interface FoodData {
  foods: { food_name: string }[];
}

export interface FoodDetail {
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
  serving: string |null ;
  servingQuantity: number;
}

interface Food {
  nf_calories: number;
  nf_protein: number;
  nf_total_carbohydrate: number;
  nf_total_fat: number;
  serving_weight_grams: number;
  photo: { thumb: string };
  food_name: string;
  alt_measures: Measure[];
  serving_unit: string;
}
interface Measure {
  serving_weight: number;
  measure: string;
}

export interface SelectedFoodData {
  foods: Food[];
}

interface DrinkItem {
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

interface SelectItem {
  label: string;
}
const Dashboard = () => {
  const [inputValue, setInputValue] = useState<string | null>(null);
  const [selectItem, setSelectItem] = useState<SelectItem[] | undefined>(undefined);
  const [modal, setModal] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectquantity, setSelectquantity] = useState<number>(1);
  const [selectCategory, setSelectCategory] = useState<string>("");
  const [logData, setLogdata] = useState<LogData | undefined>(undefined);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | string | undefined>(
    undefined
  );
  const [editMealName, setEditMealName] = useState<string >(
    ""
  );
  const [foodMeasure, setFoodMeasure] = useState<string | undefined>(undefined);
  const [showDrinkModal, setShowDrinkModal] = useState<boolean>(false);
  const [drinkUpdateModal, setDrinkUpdateModal] = useState<boolean>(false);
  const [imageData, setImageData] = useState<string | ArrayBuffer | null>(null);

  const [drinkData, setDrinkData] = useState<any>(undefined);
  const [totalWater, setTotalWater] = useState<number>();
  const [totalAlcohol, setTotalAlcohol] = useState<number | undefined>(
    undefined
  );
  const [totalCaffeine, setTotalCaffeine] = useState<number | undefined>(
    undefined
  );

  const [dailyCalorie, setDailyCalorie] =useState<number | null>(
   null
  );

  const [dataUpdated, setDataUpdated] = useState<boolean>(false);
  const [energyModal, setEnergyModal] = useState<boolean>(false);
  const [requiredWater, setRequiredWater] = useState<number >();
  const [requiredAlcohol, setRequiredAlcohol] = useState<number | null>();
  const [requiredCaffeine, setRequiredCaffeine] = useState<number | null>();
  const [updateDrinkName, setUpdateDrinkName] = useState<string>("");
  const [editDrinkModal, setEditDrinkModal] = useState<boolean>(false);
  const [drinkId, setDrinkId] = useState<number | string | undefined>(
    undefined
  );
  const [drinkName, setDrinkName] = useState<string>(); // it may be undefined
  const [imageModal, setImageModal] = useState<boolean>(false);
  const [altMeasure, setAltMeasure] = useState<string | null>(null);

  const dispatch = useDispatch();

  // const [inputValue, setInputValue] = useState<string>('');
  const authUser = auth.currentUser;
  const debouncedInputValue = debounce(
    (value: any) => setInputValue(value),
    300
  );

  // Food suggestion search bar
  const {
    data: suggestion,
    isLoading,
    isError,
  } = useFetchSuggestionsQuery(inputValue);

  const suggestions = suggestion as Suggestions;
  const handleSearch = (query: string) => {
    debouncedInputValue(query);
  };

  const groupedOptions = [
    {
      label: GROUP_OPTIONS.COMMON_LABEL,
      options: suggestions?.common.map(
        (element: CommonFood, index: number) => ({
          value: element.tag_id + index,
          label: `${element.food_name}`,
          category: GROUP_OPTIONS.COMMON_LABEL,
        })
      ),
    },
    {
      label: GROUP_OPTIONS.BRANDED_LABEL,
      options: suggestions?.branded.map(
        (element: BrandedFood, index: number) => ({
          value: element.nix_item_id + index,
          label: `${element.brand_name_item_name} - ${element.nf_calories} kcal`,
          category: GROUP_OPTIONS.BRANDED_LABEL,
        })
      ),
    },
  ];

  // Fetch Selected food details
  const [addMeal, { data }] = useAddMealMutation();

  const selectedFoodData = data as SelectedFoodData;
  //set selected item by user

  const handleSelect = (
    newValue: OnChangeValue<OptionType, boolean>,
    actionMeta: ActionMeta<OptionType>
  ) => {
    
    const selectedOption = newValue
      ? isArray(newValue)
        ? newValue
        : [newValue]
      : [];

    setSelectItem(selectedOption);
    if (selectedOption.length > 0) {
      addMeal(selectedOption[0]?.label);
    }
    setModal(true);
  };

  // Get the Meal details

  const handleGetData = async (user: User): Promise<void> => {
    try {
      dispatch(showLoader());
      if (!user) {
        return;
      }
      const userId = user.uid;

      const date = new Date().toISOString().split("T")[0];

      const docRef = doc(db, FIREBASE_DOC_REF.USER, userId, FIREBASE_DOC_REF.DAILY_LOGS, date);

      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const mealData = docSnap.data();
        setLogdata(mealData);
      } else {
        setLogdata({});
      }
    } catch (error) {
      console.error(ERROR_MESSAGES().ERROR_FETCH, error);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
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

  const handleDeleteLog = async (meal: string, id: string | number) => {
    dispatch(showLoader());
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error(FORM_VALIDATION_MESSAGES().USER_NOT_AUTHENTICATED);
      }
      const userId = user.uid;
      const date = new Date().toISOString().split("T")[0];
      const docRef = doc(db, FIREBASE_DOC_REF.USER, userId, FIREBASE_DOC_REF.DAILY_LOGS, date);
      const getData = (await getDoc(docRef)).data();
      if (!getData || !getData[meal]) {
        throw new Error(ERROR_MESSAGES().MEAL_NOT_FOUND);
      }
      const mealData = getData[meal] as MealId[];
      const updatedMealData = mealData.filter((mealItem) => mealItem.id !== id);
      await updateDoc(docRef, { [meal]: updatedMealData });
      const updatedDoc = (await getDoc(docRef)).data();
      setLogdata(updatedDoc);
      toast.success(SUCCESS_MESSAGES().SUCCESS_ITEM_DELETED);
    } catch (error) {
      console.error(error);
      toast.error(ERROR_MESSAGES().ITEM_NOT_DELETED);
    } finally {
      dispatch(hideLoader());
    }
  };

  // set the details of editable item
  const handleEditLog = (
    meal: keyof LogData,
    name: string,
    id: number | string,
  
  ) => {
    //  dispatch = useDispatch();
    const user = auth.currentUser;
    dispatch(showLoader());
    if (user) {
      handleGetData(user);
    }
    setSelectedId(id);
    setQuantity(1);
    setEditMealName(meal);

    if (logData) {
      const selectedLog = logData[meal]?.find((item: MealItem) => item.id === id);
      if (selectedLog) {
        setSelectquantity(selectedLog.servingQuantity);
      }
    } else {
      console.error(ERROR_MESSAGES().NOT_DEFINED);
    }

    addMeal(name);
    setEditModal(true);
    dispatch(hideLoader());
  };

  //Edit Meal details

  const handleEditModalData = async () => {
    try {
      dispatch(showLoader());
      const user: User | null = auth.currentUser;
      if (!user) throw new Error(FORM_VALIDATION_MESSAGES().USER_NOT_AUTHENTICATED);
      const userId: string = user.uid;
      const data: LogDataItem = {
        id: Date.now(),
        name: selectedFoodData?.foods[0]?.food_name || "",
        calories: Math.round(calculateCalories as number),
        proteins: Math.round(protein as number),
        carbs: Math.round(carbs as number),
        fats: Math.round(fats as number),
        serving: altMeasure ,
        servingQuantity: selectquantity,
      };
      const date: string = new Date().toISOString().split("T")[0];
      const docRef = doc(db, FIREBASE_DOC_REF.USER, userId, FIREBASE_DOC_REF.DAILY_LOGS, date);
      const getData = (await getDoc(docRef)).data() as LogData;
      console.log(getData);
      const mealdata = (getData as Record<string, MealItem[]>)[editMealName]?.filter(
        (meal: MealItem) => meal.id !== selectedId
      );
      await updateDoc(docRef, { [editMealName]: mealdata });

      const newData = { [selectCategory]: arrayUnion(data) };
      await updateDoc(docRef, newData);
      const updatedDoc = (await getDoc(docRef)).data() as LogData;
      setLogdata(updatedDoc);
    } catch (error) {
      console.log(error);
      toast.error(ERROR_MESSAGES().SOMETHING_WENT_WRONG);
    } finally {
      setEditModal(false);
      dispatch(hideLoader());
      setSelectCategory("");
      toast.success(SUCCESS_MESSAGES().ITEM_EDIT_SUCCESS);
    }
  };

  // Set the required meal and drinks details of user
  const dailyRequiredCalorie = async (
    setRequiredWater: (Water:number) => void,
    setRequiredCaffeine: (Caffeine:number) => void,
    setRequiredAlcohol: (Alcohol:number ) => void,
    setDailyCalorie: (calorie: number |null) => void
  ): Promise<void> => {
    const currentUser = auth.currentUser;
    const userId = currentUser?.uid;

    if (userId) {
      const userDocRef = doc(db, FIREBASE_DOC_REF.USER, userId);
      try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setRequiredWater(data.water);
          setRequiredCaffeine(data.caffeine);
          setRequiredAlcohol(data.alcohol);
          setDailyCalorie(data.calorie);
        } else {
          setDailyCalorie(null);
        }
      } catch (error) {
        console.error(ERROR_MESSAGES().ERROR_FETCH, error);
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


// console.log("requiredWater",requiredWater);  


  const calculateNutrient = (
    selectedFoodData: SelectedFoodData,
    nutrient: keyof Food,
    selectquantity: number,
    quantity: number
  ) => {
    const quantityNumber = (selectquantity as number) || 0;

    return selectedFoodData?.foods?.length > 0
      ? ((selectedFoodData?.foods[0][nutrient] as number) /
          selectedFoodData?.foods[0].serving_weight_grams) *
          quantityNumber *
          quantity
      : " ";
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

  const calculateMealNutrient = (
    mealData: mealData,
    nutrient: string
  ): number => {
    return mealData.length > 0
      ? mealData.reduce(
          (total: number, item: MealItem) => total + (item[nutrient] as number),
          0
        )
      : 0;
  };

  const calculateMealCalories = (mealData: mealData): number => {
    return calculateMealNutrient(mealData, NUTRIENT.CALORIE);
  };

  const calculateMealProtein = (mealData: mealData): number => {
    return calculateMealNutrient(mealData, NUTRIENT.PROTEIN);
  };

  const calculateMealCarbs = (mealData: mealData): number => {
    return calculateMealNutrient(mealData, NUTRIENT.CARBS);
  };

  const calculateMealFats = (mealData: mealData): number => {
    return calculateMealNutrient(mealData, NUTRIENT.FATS);
  };

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

// console.log("totalCalories",totalCalories);
//   console.log("dailyCalorie",dailyCalorie);
  const calculateNutrients = (dailyCalorie:number) => {
  

    // console.log(dailyCalorie);
    // Calculate calories
    const proteinCalories: number = dailyCalorie * proteinPercent;
    const carbsCalories: number = dailyCalorie * carbsPercent;
    const fatsCalories: number = dailyCalorie * fatsPercent;

    // Convert calories to grams
    const proteinGrams: number = Math.round(proteinCalories / 4);
    const carbsGrams: number = Math.round(carbsCalories / 4);
    const fatsGrams: number = Math.round(fatsCalories / 9);
    // console.log("proteinGrams",proteinGrams);

    return {
      proteinGrams,
      carbsGrams,
      fatsGrams,
    };
  };


  // Safely access `dailyCalorie.calorie` with null checks
  const validDailyCalorie = dailyCalorie ?? 0;

  const { proteinGrams, carbsGrams, fatsGrams } =
    calculateNutrients(dailyCalorie as number);

  const requiredCalorie =
    validDailyCalorie > 0 ? validDailyCalorie - totalCalories : 0;

  const progressPercent: number = dailyCalorie
    ? Math.floor((totalCalories / validDailyCalorie) * 100)
    : 0;
  const proteinPercentage: number = Math.floor(
    (totalProtein / proteinGrams) * 100
  );
  const carbsPercentage: number = Math.floor((totalCarbs / carbsGrams) * 100);
  const fatsPercentage: number = Math.floor((totalFats / fatsGrams) * 100);

  // Doughnut Data

  //Doughnut Data

  const doughnutdata = {
    labels: [MEALTYPE.BREAKFAST,MEALTYPE.LUNCH, MEALTYPE.SNACK, MEALTYPE.DINNER],
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

  const getPercentage = (value: number, total: number): number => {
    return (value / total) * 100;
  };

  const total = doughnutdata?.datasets[0]?.data.reduce(
    (sum, value) => sum + value,
    0
  );

  const handleNutritionModal = (foodDetail: FoodDetail): void => {
    addMeal(foodDetail?.name);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  //  Get Drinks
  const getDrinkData = async (user: User) => {
    try {
      dispatch(showLoader());
      if (!user) {
        return;
      }
      const userId = user.uid;
      const date = new Date().toISOString().split("T")[0];
      const docRef = doc(db, FIREBASE_DOC_REF.USER, userId, FIREBASE_DOC_REF.DAILY_LOGS, date);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const getData = docSnap.data();
        setDrinkData(getData);
      } else {
        setDrinkData({});
      }
    } catch (error) {
      console.error(ERROR_MESSAGES().ERROR_FETCH, error);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        getDrinkData(user);
      } else {
        console.log(FORM_VALIDATION_MESSAGES().USER_NOT_AUTHENTICATED);
      }
    });
    return () => unsubscribe();
  }, [dataUpdated]);

  const handleDataUpdated = () => {
    setDataUpdated((prev) => !prev);
  };

  //Drinks Calculation
  const calculateTotals = () => {
    const calculateDrinkTotals = (drinkData: DrinkData | undefined) => {
      return isArray(drinkData) && drinkData.length > 0
        ? drinkData.reduce(
            (total: number, drinkItem: DrinkItem) =>
              total + drinkItem.totalAmount,
            0
          )
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
  const isSignup = useSelector((state: RootState) => state.Auth.signedup);
  useEffect(() => {
    if (isSignup === true) {
      setEnergyModal(true);
       dispatch(setSignout())
    }
  }, []);

  const handleUpdateDrink = (drinks: Drink): void => {
    setUpdateDrinkName(drinks.drinklabel);
    setDrinkUpdateModal(true);
  };

  const drinkType = {
    water: { drinklabel: DRINK_TYPE.WATER },
    caffeine: { drinklabel: DRINK_TYPE.CAFFEINE },
    alcohol: { drinklabel: DRINK_TYPE.ALCOHOL },
  };


  //  console.log("altmeasure",altMeasure);
  const handleModalData = async (

    
  ) => {

  
    if (!selectquantity || !selectCategory) {
      toast.error(VALIDATION.SELECT_ALL);
      return;
    }
    if (!quantity || quantity <= 0) {
      toast.error(VALIDATION.SELECT_QUANTITY);
      return;
    }
    try {
      dispatch(showLoader());
      // console.log("inside handleModalData2");
      const user = auth.currentUser;
      const data: Data = {
        id: Date.now(),
        name: selectItem?.[0]?.label ?? '',
        calories: Math.round(calculateCalories as number),
        proteins: Math.round(protein as number),
        carbs: Math.round(carbs as number ),
        fats: Math.round(fats as number),
        serving: altMeasure,
        servingQuantity: selectquantity,
      };
      if (user) {
        const userId = user.uid;
        const date = new Date().toISOString().split("T")[0];
        const docRef = doc(db, FIREBASE_DOC_REF.USER, userId, FIREBASE_DOC_REF.DAILY_LOGS, date);

        // console.log("data",data);
        const categorisedData = { [selectCategory]: arrayUnion(data) };
  
        await setDoc(docRef, categorisedData, { merge: true });
        await handleGetData(user);
  
        toast.success(SUCCESS_MESSAGES().SUCCESS_ITEM_ADD);
        setModal(false);
      }
    } catch (error) {
      toast.error(ERROR_MESSAGES().ERROR_SAVING_DATA);
      console.error(ERROR_MESSAGES().ERROR_SAVING_DATA, error);
    } finally {
      dispatch(hideLoader());
      setSelectCategory("");
    }
  };

 
  return (
    <>
      {/* <Navbar /> */}
      <div
        className="search"
        style={{ backgroundImage: `url(${IMAGES.bgSelectImage})` }}
      >
        <h1 id="header-text">{LABEL.SEARCH_MEAL}</h1>

        <Select
          id="search-box"
          options={groupedOptions}
          onChange={handleSelect}
          onInputChange={handleSearch}
          placeholder="Search here ..."
          className="search-bar"
        />
        <h1 id="header-text">{LABEL.OR}</h1>
      </div>

      <h2 style={{ padding: "40px" }}>
       {LABEL.AI_FOOD_VISION}
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
         AI Visual Food Search
        </button>
        <CustomModal isOpen={imageModal} onClose={() => setImageModal(false)}>
          <ImageSearch
            setImageModal={setImageModal}
            setImageData={setImageData}
            // setSelectCategory={setSelectCategory}
            handleGetData={handleGetData}
          ></ImageSearch>
        </CustomModal>
      </div>

      {/* Energy Modal */}
      <CustomModal isOpen={energyModal} onClose={() => setEnergyModal(false)}>
        <SetCalorieModal setEnergyModal={setEnergyModal} />
      </CustomModal>

      <CustomModal isOpen={modal} onClose={() => setModal(false)}>
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
          selectCategory={selectCategory}
          handleModalData={handleModalData}
          // setFoodMeasure={setFoodMeasure}
          setAltMeasure={setAltMeasure}
        />
      </CustomModal>

      {/* Meal Table  */}
      <Table
        logData={logData}
        handleNutritionModal={handleNutritionModal}
        handleEditLog={handleEditLog}
        handleDeleteLog={handleDeleteLog}
        showFeature={true}
      />

      {/* Meal Progress Line Graph  */}

      <MealProgress
        totalCalories={totalCalories}
        dailyCalorie={dailyCalorie}
        progressPercent={progressPercent}
        totalProtein={totalProtein}
        proteinGrams={proteinGrams}
        proteinPercentage={proteinPercentage}
        totalCarbs={totalCarbs}
        carbsGrams={carbsGrams}
        carbsPercentage={carbsPercentage}
        totalFats={totalFats}
        fatsGrams={fatsGrams}
        fatsPercentage={fatsPercentage}
      />

      {/* Doughnut Data */}
      <div className="total-calorie">
        <h2 style={{ marginTop: "2%", color: "darkgrey", fontSize: "2.5rem" }}>
          {" "}
         {LABEL.YOUR_TODAY_MEAL}
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
                  <strong>{label}:</strong> {value} {FORM.KCAL} ({percentage}%)
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Update Meal Data  */}
      <CustomModal isOpen={editModal} onClose={() => setEditModal(false)}>
        <UpdateMeal
          setModal={setEditModal}
          quantity={quantity}
          setQuantity={setQuantity}
          mealName={editMealName}
          selectquantity={selectquantity}
          setSelectquantity={setSelectquantity}
          selectedFoodData={selectedFoodData}
          selectCategory={selectCategory}
          setSelectCategory={setSelectCategory}
          calculateCalories={calculateCalories}
          handleEditModalData={handleEditModalData}
        />
      </CustomModal>

      {/* Nutrition Details */}
      <CustomModal isOpen={isModalOpen} onClose={handleCloseModal}>
        <NutritionModal
          onClose={handleCloseModal}
          selectedFoodData={selectedFoodData}
        />
      </CustomModal>

      {/* Drink Section */}

      <div className="drink-section">
        <h2 style={{ color: "darkgrey", fontSize: "2.5rem" }}>
         {LABEL.WATER_AND_BEVERAGE}
        </h2>
        <button
          className="ai-search-button"
          onClick={() => setShowDrinkModal(true)}
        >
        {LABEL.ADD_DRINK}
          <span className="ai-search-button-icon">
            <FaSearch size={16} color="white" />
          </span>
        </button>

        <CustomModal
          isOpen={showDrinkModal}
          onClose={() => setShowDrinkModal(false)}
        >
          <DrinkModal
            setShowDrinkModal={setShowDrinkModal}
            onDataUpdated={handleDataUpdated}
          />
        </CustomModal>

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
                  style={DRINK_TABLE_STYLE}
                >
                  {LABEL.DRINK}
                </th>
                <th
                  style={DRINK_TABLE_STYLE}
                >
                 {LABEL.DRINK_QUANTITY}
                </th>
                <th
                  style={DRINK_TABLE_STYLE}
                >
                {LABEL.ACTION}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                  <img
                    src={IMAGES.water}
                    alt="Water"
                    style={{ height: "60px" }}
                  />
                  <p style={{ margin: "2px 0", fontWeight: "bold" }}>{DRINK_TYPE.WATER}</p>
                </td>
                <td style={{ padding: "12x", border: "1px solid #ddd" }}>
                  {totalWater} {FORM.ML}
                </td>
                <td>
                  <div style={{ display: "flex" }}>
                    <span
                      onClick={() => handleUpdateDrink(drinkType.water)}
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
                    src={IMAGES.beer}
                    alt="Alcohol"
                    style={{ height: "60px" }}
                  />
                  <p style={{ margin: "2px 0", fontWeight: "bold" }}>{DRINK_TYPE.ALCOHOL}</p>
                </td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                  {totalAlcohol} {FORM.ML}
                </td>
                <td>
                  <div style={{ display: "flex" }}>
                    <span
                      onClick={() => handleUpdateDrink(drinkType.alcohol)}
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
                    src={IMAGES.coffee}
                    alt="Caffeine"
                    style={{ height: "60px" }}
                  />
                  <p style={{ margin: "2px 0", fontWeight: "bold" }}>
                    {DRINK_TYPE.CAFFEINE}
                  </p>
                </td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                  {totalCaffeine} {FORM.ML}
                </td>
                <td>
                  <div style={{ display: "flex" }}>
                    <span
                      onClick={() => handleUpdateDrink(drinkType.caffeine)}
                      className="icon-button edit"
                    >
                      <FaEdit />
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <CustomModal
            isOpen={drinkUpdateModal}
            onClose={() => setDrinkUpdateModal(false)}
          >
            <UpdateDrinkModal
              setDrinkUpdateModal={setDrinkUpdateModal}
              onDataUpdated={handleDataUpdated}
              updateDrinkName={updateDrinkName}
              editDrinkModal={editDrinkModal}
              setEditDrinkModal={setEditDrinkModal}
              setDrinkId={setDrinkId}
              setDrinkName={setDrinkName}
            />
          </CustomModal>

          <CustomModal
            isOpen={editDrinkModal}
            onClose={() => setEditDrinkModal(false)}
          >
            <UpdateDrinkPage
              setEditDrinkModal={setEditDrinkModal}
              onDataUpdated={handleDataUpdated}
              drinkName={drinkName || ""}
              drinkId={drinkId}
            />
          </CustomModal>

          {/* Water Progress Line Graph   */}
          <DrinkProgress
            totalWater={totalWater || 0}
            requiredWater={requiredWater  as number}
            totalAlcohol={totalAlcohol || 0}
            requiredAlcohol={requiredAlcohol as number}
            totalCaffeine={totalCaffeine || 0}
            requiredCaffeine={requiredCaffeine as number}
          />
        </div>
      </div>
      {/* <Footer className="footer" /> */}
    </>
  );
};

export default Dashboard;