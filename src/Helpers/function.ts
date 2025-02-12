import { useMemo } from "react";
import { NUM } from "../Shared";
import { DrinkItem, MealItem, mealData } from "../Views/Dashboard/Dashboard";
import { MEALTYPE, NUTRIENT } from "../Shared/Constants";
import colors from "../assets/Css/color";

export const capitalizeFirstLetter = (text?: string): string => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const debounce = (func: (...args: any[]) => void, limit: number) => {
  let inDebounce: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: any[]) {
    if (inDebounce) {
      clearTimeout(inDebounce);
    }
    inDebounce = setTimeout(() => {
      func.apply(this, args);
      inDebounce = null;
    }, limit);
  };
};

export const Throttle = (func: (...args: any[]) => void, delay: number) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (...args: any[]) {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
      timeout = null;
    }, delay);
  };
};

export const dateFunction = new Date().toISOString().split("T")[0];

export const getPercentage = (value: number, total: number): number => {
  return Math.floor((value / total) * NUM.HUNDRED);
};

export const calculateCalories = (
  mealData?: { calories: number }[]
): number => {
  return mealData?.length
    ? mealData.reduce((total, item) => total + item.calories, 0)
    : 0;
};

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

const calculateDrinkTotals = (drinkItems?: DrinkItem[]) => {
  return Array.isArray(drinkItems) && drinkItems.length > 0
    ? drinkItems.reduce((total, drinkItem) => total + drinkItem.totalAmount, 0)
    : 0;
};

//  function to generate chart data
const getChartData = (
  breakfastCalorie: number,
  lunchCalorie: number,
  snackCalorie: number,
  dinnerCalorie: number
) => ({
  labels: [MEALTYPE.BREAKFAST, MEALTYPE.LUNCH, MEALTYPE.SNACK, MEALTYPE.DINNER],
  datasets: [
    {
      data: [breakfastCalorie, lunchCalorie, snackCalorie, dinnerCalorie],
      backgroundColor: [
        colors.berakfast_color,
        colors.lunch_color,
        colors.snacks_color,
        colors.dinner_color,
      ],
      hoverOffset: 1,
    },
  ],
});

const totalNutrient = (
  lunchNutrient: number,
  snackNutrient: number,
  breakfastNutrient: number,
  dinnerNutrient: number
) => {
  return lunchNutrient + snackNutrient + breakfastNutrient + dinnerNutrient;
};


export {
  calculateMealCalories,
  calculateMealFats,
  calculateMealCarbs,
  calculateMealProtein,
  calculateDrinkTotals,
  getChartData,
  totalNutrient,
};
