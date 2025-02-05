import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { dateFunction, debounce } from "../../Helpers/function";
import { hideLoader, showLoader } from "../../Store/Loader";
import firebaseConfig, { auth, db } from "../../Utils/firebase";
import { initializeApp } from "firebase/app";
import { string } from "yup";
import { Dispatch } from "@reduxjs/toolkit";
import {
  ERROR_MESSAGES,
  FORM,
  FORM_VALIDATION_MESSAGES,
  IMAGES,
  LABEL,
  NUM,
  SUCCESS_MESSAGES,
} from "../../Shared";
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
import {
  DRINK_TYPE,
  FIREBASE_DOC_REF,
  GROUP_OPTIONS,
  MEALTYPE,
  NUTRIENT,
  VALIDATION,
} from "../../Shared/Constants";
import { DRINK_TABLE_STYLE } from "../../assets/Css/customStyle";
import colors from "../../assets/Css/color";
import DrinkTable from "./Components/DrinkTable/DrinkTable";
// import SetCalorieModal from "./Modals/SetNutrition/SetCalorie";

ChartJS.register(ArcElement, Tooltip, Legend);

export interface Drink {
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
  serving: string | null;
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

export interface LogDataItem {
  id: string | number;
  name: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  serving?: string | null;
  servingQuantity?: number;
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

export interface DrinkItem {
  id: string;
  drinklabel: string;
  totalAmount: number;
}

export interface DrinkData {
  [category: string]: DrinkItem[];
}

interface ValidDailyCalorie {
  calorie: number | null;
}

interface SelectItem {
  label: string;
}
const Dashboard = () => {
  const [inputValue, setInputValue] = useState<string | null>(null);
  const [selectItem, setSelectItem] = useState<SelectItem[] | undefined>(
    undefined
  );
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
  const [editMealName, setEditMealName] = useState<string>("");
  const [foodMeasure, setFoodMeasure] = useState<string | undefined>(undefined);
  const [showDrinkModal, setShowDrinkModal] = useState<boolean>(false);
  const [drinkUpdateModal, setDrinkUpdateModal] = useState<boolean>(false);
  const [imageData, setImageData] = useState<LogDataItem | null>(null);

  const [drinkData, setDrinkData] = useState<DrinkData>({});

  const [totalWater, setTotalWater] = useState<number>();
  const [totalAlcohol, setTotalAlcohol] = useState<number | undefined>(
    undefined
  );
  const [totalCaffeine, setTotalCaffeine] = useState<number | undefined>(
    undefined
  );

  const [dailyCalorie, setDailyCalorie] = useState<number | null>(null);

  const [dataUpdated, setDataUpdated] = useState<boolean>(false);
  const [energyModal, setEnergyModal] = useState<boolean>(false);
  const [requiredWater, setRequiredWater] = useState<number>();
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

  console.log("drinkData", drinkData);
  // const [inputValue, setInputValue] = useState<string>('');
  const authUser = auth.currentUser;
  const debouncedInputValue = debounce(
    (value: string) => setInputValue(value),
    300
  );

  // console.log("input value",inputValue);
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

  const handleGetData = useCallback(
    async (user: User): Promise<void> => {
      try {
        dispatch(showLoader());
        if (!user) return;
        const userId = user.uid;
        const date = dateFunction;
        const docRef = doc(
          db,
          FIREBASE_DOC_REF.USER,
          userId,
          FIREBASE_DOC_REF.DAILY_LOGS,
          date
        );
        const docSnap = await getDoc(docRef);
        setLogdata(docSnap.exists() ? docSnap.data() : {});
      } catch (error) {
        console.error(ERROR_MESSAGES().ERROR_FETCH, error);
      } finally {
        dispatch(hideLoader());
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) handleGetData(user);
    });
    return () => unsubscribe();
  }, [handleGetData]);

  const handleDeleteLog = async (meal: string, id: string | number) => {
    dispatch(showLoader());
    try {
      const user = auth.currentUser;
      if (!user)
        throw new Error(FORM_VALIDATION_MESSAGES().USER_NOT_AUTHENTICATED);
      const userId = user.uid;
      const date = dateFunction;
      const docRef = doc(
        db,
        FIREBASE_DOC_REF.USER,
        userId,
        FIREBASE_DOC_REF.DAILY_LOGS,
        date
      );
      const getData = (await getDoc(docRef)).data();
      if (!getData || !getData[meal])
        throw new Error(ERROR_MESSAGES().MEAL_NOT_FOUND);
      const updatedMealData = getData[meal].filter(
        (mealItem: MealId) => mealItem.id !== id
      );
      await updateDoc(docRef, { [meal]: updatedMealData });
      setLogdata((await getDoc(docRef)).data());
      toast.success(SUCCESS_MESSAGES().SUCCESS_ITEM_DELETED);
    } catch (error) {
      console.error(error);
      toast.error(ERROR_MESSAGES().ITEM_NOT_DELETED);
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleEditLog = (
    meal: keyof LogData,
    name: string,
    id: number | string
  ) => {
    const user = auth.currentUser;
    if (user) handleGetData(user);
    setSelectedId(id);
    setQuantity(1);
    setEditMealName(meal);
    if (logData) {
      const selectedLog = logData[meal]?.find(
        (item: MealItem) => item.id === id
      );
      if (selectedLog) setSelectquantity(selectedLog.servingQuantity);
    } else {
      console.error(ERROR_MESSAGES().NOT_DEFINED);
    }
    addMeal(name);
    setEditModal(true);
  };

  const handleEditModalData = async () => {
    dispatch(showLoader());
    try {
      const user = auth.currentUser;
      if (!user)
        throw new Error(FORM_VALIDATION_MESSAGES().USER_NOT_AUTHENTICATED);
      const userId = user.uid;
      const data: LogDataItem = {
        id: Date.now(),
        name: selectedFoodData?.foods[0]?.food_name || "",
        calories: Math.round(calculateCalories as number),
        proteins: Math.round(protein as number),
        carbs: Math.round(carbs as number),
        fats: Math.round(fats as number),
        serving: altMeasure,
        servingQuantity: selectquantity,
      };
      const date = dateFunction;
      const docRef = doc(
        db,
        FIREBASE_DOC_REF.USER,
        userId,
        FIREBASE_DOC_REF.DAILY_LOGS,
        date
      );
      const getData = (await getDoc(docRef)).data() as LogData;
      const mealdata = (getData as Record<string, MealItem[]>)[
        editMealName
      ]?.filter((meal: MealItem) => meal.id !== selectedId);
      await updateDoc(docRef, { [editMealName]: mealdata });
      await updateDoc(docRef, { [selectCategory]: arrayUnion(data) });
      setLogdata((await getDoc(docRef)).data());
      toast.success(SUCCESS_MESSAGES().ITEM_EDIT_SUCCESS);
    } catch (error) {
      console.error(error);
      toast.error(ERROR_MESSAGES().SOMETHING_WENT_WRONG);
    } finally {
      setEditModal(false);
      dispatch(hideLoader());
      setSelectCategory("");
    }
  };

  const dailyRequiredCalorie = useCallback(
    async (
      setRequiredWater: (Water: number) => void,
      setRequiredCaffeine: (Caffeine: number) => void,
      setRequiredAlcohol: (Alcohol: number) => void,
      setDailyCalorie: (calorie: number | null) => void
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
    },
    []
  );

  useEffect(() => {
    dailyRequiredCalorie(
      setRequiredWater,
      setRequiredCaffeine,
      setRequiredAlcohol,
      setDailyCalorie
    );
  }, [logData, dailyRequiredCalorie]);

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

  const CalculateMealNutrient = (
    mealData: mealData,
    nutrient: string
  ): number => {
    return useMemo(() => calculateMealNutrient(mealData, nutrient), [mealData]);
  };

  const calculateMealCalories = (mealData: mealData): number =>
    CalculateMealNutrient(mealData, NUTRIENT.CALORIE);
  const calculateMealProtein = (mealData: mealData): number =>
    CalculateMealNutrient(mealData, NUTRIENT.PROTEIN);
  const calculateMealCarbs = (mealData: mealData): number =>
  CalculateMealNutrient(mealData, NUTRIENT.CARBS);
  const calculateMealFats = (mealData: mealData): number =>
    CalculateMealNutrient(mealData, NUTRIENT.FATS);

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

  const proteinPercent: number = NUM.TWO_FIVE;
  const carbsPercent: number = NUM.ZERO_FIVE;
  const fatsPercent: number = NUM.TWO_FIVE;

  const calculateNutrients = (dailyCalorie: number) => {
    // console.log(dailyCalorie);
    // Calculate calories
    const proteinCalories: number = dailyCalorie * proteinPercent;
    const carbsCalories: number = dailyCalorie * carbsPercent;
    const fatsCalories: number = dailyCalorie * fatsPercent;

    // Convert calories to grams
    const proteinGrams: number = Math.round(proteinCalories / NUM.FOUR);
    const carbsGrams: number = Math.round(carbsCalories / NUM.FOUR);
    const fatsGrams: number = Math.round(fatsCalories / NUM.NINE);
    // console.log("proteinGrams",proteinGrams);

    return {
      proteinGrams,
      carbsGrams,
      fatsGrams,
    };
  };

  // Safely access `dailyCalorie.calorie` with null checks
  const validDailyCalorie = dailyCalorie ?? 0;

  const { proteinGrams, carbsGrams, fatsGrams } = calculateNutrients(
    dailyCalorie as number
  );

  const requiredCalorie =
    validDailyCalorie > 0 ? validDailyCalorie - totalCalories : 0;

  const progressPercent: number = dailyCalorie
    ? Math.floor((totalCalories / validDailyCalorie) * NUM.HUNDRED)
    : 0;
  const proteinPercentage: number = Math.floor(
    (totalProtein / proteinGrams) * NUM.HUNDRED
  );
  const carbsPercentage: number = Math.floor(
    (totalCarbs / carbsGrams) * NUM.HUNDRED
  );
  const fatsPercentage: number = Math.floor(
    (totalFats / fatsGrams) * NUM.HUNDRED
  );

  //Doughnut Data

  const doughnutdata = {
    labels: [
      MEALTYPE.BREAKFAST,
      MEALTYPE.LUNCH,
      MEALTYPE.SNACK,
      MEALTYPE.DINNER,
    ],
    datasets: [
      {
        data: [breakfastCalorie, lunchCalorie, snackCalorie, dinnerCalorie],
        backgroundColor: [
          colors.berakfast_color,
          colors.lunch_color,
          colors.snacks_color,
          colors.dinner_color,
        ],
      },
    ],
  };

  const getPercentage = (value: number, total: number): number => {
    return (value / total) * NUM.HUNDRED;
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
      const date = dateFunction;
      const docRef = doc(
        db,
        FIREBASE_DOC_REF.USER,
        userId,
        FIREBASE_DOC_REF.DAILY_LOGS,
        date
      );
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
    const calculateDrinkTotals = (drinkItems?: DrinkItem[]) => {
      return Array.isArray(drinkItems) && drinkItems.length > 0
        ? drinkItems.reduce(
            (total, drinkItem) => total + drinkItem.totalAmount,
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
      dispatch(setSignout());
    }
  }, []);

  const handleUpdateDrink = (drinks: Drink): void => {
    setUpdateDrinkName(drinks.drinklabel);
    setDrinkUpdateModal(true);
  };

  //  console.log("altmeasure",altMeasure);
  const handleModalData = async () => {
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
        name: selectItem?.[0]?.label ?? "",
        calories: Math.round(calculateCalories as number),
        proteins: Math.round(protein as number),
        carbs: Math.round(carbs as number),
        fats: Math.round(fats as number),
        serving: altMeasure,
        servingQuantity: selectquantity,
      };
      if (user) {
        const userId = user.uid;
        const date = dateFunction;
        const docRef = doc(
          db,
          FIREBASE_DOC_REF.USER,
          userId,
          FIREBASE_DOC_REF.DAILY_LOGS,
          date
        );

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

      <h2 style={{ padding: "40px" }}>{LABEL.AI_FOOD_VISION}</h2>
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
        <DrinkTable
          totalWater={totalWater}
          totalAlcohol={totalAlcohol}
          totalCaffeine={totalCaffeine}
          handleUpdateDrink={handleUpdateDrink}
        />

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
          requiredWater={requiredWater as number}
          totalAlcohol={totalAlcohol || 0}
          requiredAlcohol={requiredAlcohol as number}
          totalCaffeine={totalCaffeine || 0}
          requiredCaffeine={requiredCaffeine as number}
        />
      </div>
    </>
  );
};

export default Dashboard;
