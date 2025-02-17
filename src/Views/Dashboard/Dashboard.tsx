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
import {
  calculateDrinkTotals,
  calculateMealCalories,
  calculateMealCarbs,
  calculateMealFats,
  calculateMealProtein,
  dateFunction,
  debounce,
  getChartData,
  getPercentage,
  getTotalFromChartData,
  totalNutrient,
} from "../../Helpers/function";
import { hideLoader, showLoader } from "../../Store/Loader";
import firebaseConfig, { auth, db } from "../../Utils/firebase";

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

import UpdateMeal from "./Modals/UpdateMeal/UpdateMeal";
import NutritionModal from "./Modals/Nutrition/NutritionModal";
import UpdateDrinkModal from "./Modals/UpdateDrink/UpdateDrinkModal";

import DrinkProgress from "./Components/DrinkProgress/DrinkProgress";
import { RootState } from "../../Store";
import MealProgress from "./Components/MealProgress/MealProgress";
import SetCalorieModal from "./Modals/SetNutrition/SetCalorie";
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

import Table from "../../Components/Shared/Table";
import DrinkTable from "../../Components/Shared/DrinkTable/DrinkTable";
import UpdateDrink from "./Modals/UpdateDrinkPage/UpdateDrink";

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

export interface DailyRequirement {
  calorie: number;
  water: number;
  alcohol: number;
  caffeine: number;
}
export type mealData = MealItem[];

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

  const [dailyCalorie, setDailyCalorie] = useState<number | null>(null);
  const [dataUpdated, setDataUpdated] = useState<boolean>(false);
  const [energyModal, setEnergyModal] = useState<boolean>(false);
  const [dailyRequiredData, setDailyRequiredData] =
    useState<DailyRequirement | null>(null);
  const [updateDrinkName, setUpdateDrinkName] = useState<string>("");
  const [editDrinkModal, setEditDrinkModal] = useState<boolean>(false);
  const [drinkId, setDrinkId] = useState<number | string | undefined>(
    undefined
  );
  const [drinkName, setDrinkName] = useState<string>(""); // it may be undefined
  const [imageModal, setImageModal] = useState<boolean>(false);
  const [altMeasure, setAltMeasure] = useState<string | null>(null);

  const dispatch = useDispatch();

  const debouncedInputValue = debounce(
    (value: string) => setInputValue(value),
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

  const handleGetData = useCallback(async (user: User): Promise<void> => {
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

      if (docSnap.exists()) {
        const getData = docSnap.data();
        setLogdata(docSnap.data());
        setDrinkData(getData);
      } else {
        setDrinkData({});
        setLogdata({});
      }
    } catch (error) {
      console.error(ERROR_MESSAGES().ERROR_FETCH, error);
    } finally {
      dispatch(hideLoader());
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) handleGetData(user);

      
    });
    return () => unsubscribe();
  }, [handleGetData, dataUpdated]);

  
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

  const dailyRequiredCalorie = useCallback(async (): Promise<void> => {
    const currentUser = auth.currentUser;
    const userId = currentUser?.uid;
    if (userId) {
      const userDocRef = doc(db, FIREBASE_DOC_REF.USER, userId);
      try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();

          setDailyRequiredData(data as DailyRequirement);
          setDailyCalorie(data.calorie);
        } else {
          setDailyRequiredData(null);
        }
      } catch (error) {
        console.error(ERROR_MESSAGES().ERROR_FETCH, error);
      }
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dailyRequiredCalorie();
      }
    });
   
    return () => unsubscribe();
  }, []);

  // Check implementation calculateNutrient
  const calculateNutrient = useMemo(
    () =>
      (
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
      },
    [selectquantity, quantity]
  );

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


  const totalCalories = totalNutrient(
    breakfastCalorie,
    lunchCalorie,
    snackCalorie,
    dinnerCalorie
  );

  const totalProtein = totalNutrient(
    breakfastProtein,
    lunchProtein,
    snackProtein,
    dinnerProtein
  );

  const totalCarbs = totalNutrient(
    breakfastCarbs,
    lunchCarbs,
    snackCarbs,
    dinnerCarbs
  );
  const totalFats = totalNutrient(
    breakfastFats,
    lunchFats,
    snackFats,
    dinnerFats
  );

  // Reference percentage of protein ,carbs and fats in daily Energy(calorie);
  const proteinPercent: number = NUM.TWO_FIVE;
  const carbsPercent: number = NUM.ZERO_FIVE;
  const fatsPercent: number = NUM.TWO_FIVE;

  const calculateNutrients = (dailyCalorie: number) => {
    // Calculate calories
    const proteinCalories: number = dailyCalorie * proteinPercent;
    const carbsCalories: number = dailyCalorie * carbsPercent;
    const fatsCalories: number = dailyCalorie * fatsPercent;

    // Convert calories to grams
    const proteinGrams: number = Math.round(proteinCalories / NUM.FOUR);
    const carbsGrams: number = Math.round(carbsCalories / NUM.FOUR);
    const fatsGrams: number = Math.round(fatsCalories / NUM.NINE);

    return {
      proteinGrams,
      carbsGrams,
      fatsGrams,
    };
  };

  const validDailyCalorie = dailyCalorie ?? 0;
  const { proteinGrams, carbsGrams, fatsGrams } = calculateNutrients(
    dailyCalorie as number
  );

  const progressPercent = getPercentage(totalCalories, validDailyCalorie);
  const carbsPercentage = getPercentage(totalCarbs, carbsGrams);
  const fatsPercentage = getPercentage(totalFats, fatsGrams);
  const proteinPercentage = getPercentage(totalProtein, proteinGrams);

  //Doughnut Data
  const chartData = useMemo(
    () =>
      getChartData(breakfastCalorie, lunchCalorie, snackCalorie, dinnerCalorie),
    [breakfastCalorie, lunchCalorie, snackCalorie, dinnerCalorie]
  );

  const total  = getTotalFromChartData(chartData);

  const handleNutritionModal = (foodDetail: FoodDetail): void => {
    addMeal(foodDetail?.name);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };



  const handleDataUpdated = () => {
    setDataUpdated((prev) => !prev);
  };

  //Drinks Calculation

  const totalWater = calculateDrinkTotals(drinkData?.Water);
  const totalAlcohol = calculateDrinkTotals(drinkData?.Alcohol);
  const totalCaffeine = calculateDrinkTotals(drinkData?.Caffeine);

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
        <h1 style={{ color: "white" }}>{LABEL.OR}</h1>
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
          {LABEL.AI_VISUAL_SEARCH}
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
        <h2
          style={{
            marginTop: "2%",
            color: colors.geyColor_dark,
            fontSize: "2.5rem",
          }}
        >
          {" "}
          {LABEL.YOUR_TODAY_MEAL}
        </h2>
        <div className="doughnut-data">
          <div className="doughnut-graph">
            <Doughnut data={chartData} />
          </div>
          <div className="doughnut-text">
            {chartData.labels.map((label, index) => {
              const value = chartData.datasets[0].data[index];
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
        <h2 style={{ color: colors.geyColor_dark, fontSize: "2.5rem" }}>
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
          showAction={true}
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
            drinkDetails={drinkData}
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
          <UpdateDrink
            setEditDrinkModal={setEditDrinkModal}
            onDataUpdated={handleDataUpdated}
            drinkName={drinkName || ""}
            drinkId={drinkId}
          />
        </CustomModal>

        <DrinkProgress
          totalWater={totalWater || 0}
          dailyRequirement={dailyRequiredData}
          totalAlcohol={totalAlcohol || 0}
          totalCaffeine={totalCaffeine || 0}
        />
      </div>
    </>
  );
};

export default Dashboard;
