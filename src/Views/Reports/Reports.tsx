import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, getFirestore, onSnapshot } from "firebase/firestore";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
ChartJS.register(ArcElement, Tooltip, Legend);
import "./Reports.css";
import { hideLoader, showLoader } from "../../Store/Loader";
import firebaseConfig, { auth, db } from "../../Utils/firebase";
import { initializeApp } from "firebase/app";
import { RootState } from "../../Store";
import {
  ERROR_MESSAGES,
  FORM,
  FORM_VALIDATION_MESSAGES,
  IMAGES,
  LABEL,
} from "../../Shared";
import Table from "../../Components/Shared/Table";
import { DrinkData, DrinkItem, LogData } from "../Dashboard/Dashboard";
import { FIREBASE_DOC_REF, MEALTYPE } from "../../Shared/Constants";
import colors from "../../assets/Css/color";
import {
  calculateCalories,
  calculateDrinkTotals,
  dateFunction,
  getChartData,
  getPercentage,
  getTotalFromChartData,
} from "../../Helpers/function";
import DrinkTable from "../../Components/Shared/DrinkTable/DrinkTable";
import { toast } from "react-toastify";

const Reports: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logData, setLogdata] = useState<LogData | undefined>();
  const [selectDate, setSelectDate] = useState<string>(dateFunction);
  const [drinkData, setDrinkData] = useState<DrinkData>({});
  // Loader from Redux

  const loader = useSelector((state: RootState) => state.Loader.loading);

  // Fetch User Data from Firestore

  const handleGetData = useCallback(
    async (user: User | null) => {
      try {
        dispatch(showLoader());
        if (!user) {
          dispatch(hideLoader());
          return;
        }
        const userId = user.uid;
        const date = selectDate;
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
          setLogdata(getData);
          setDrinkData(getData);
        } else {
          setLogdata({});
          setDrinkData({});
        }
      } catch (error) {
        console.error(ERROR_MESSAGES().ERROR_FETCH, error);
      } finally {
        dispatch(hideLoader());
      }
    },
    [selectDate]
  );

  // Watch for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        dispatch(showLoader());
        handleGetData(user);
      } else {
        dispatch(hideLoader());
      }
    });

    return () => unsubscribe();
  }, [handleGetData]);

  // Calorie calculations
  const breakfastCalorie = calculateCalories(logData?.Breakfast);
  const lunchCalorie = calculateCalories(logData?.Lunch);
  const snackCalorie = calculateCalories(logData?.Snack);
  const dinnerCalorie = calculateCalories(logData?.Dinner);

  const totalCalories = useMemo(() => {
    return breakfastCalorie + lunchCalorie + snackCalorie + dinnerCalorie;
  }, [breakfastCalorie, lunchCalorie, snackCalorie, dinnerCalorie]);

  const chartData = useMemo(
    () =>
      getChartData(breakfastCalorie, lunchCalorie, snackCalorie, dinnerCalorie),
    [breakfastCalorie, lunchCalorie, snackCalorie, dinnerCalorie]
  );

  const total = getTotalFromChartData(chartData);
  const totalWater = calculateDrinkTotals(drinkData?.Water);
  const totalAlcohol = calculateDrinkTotals(drinkData?.Alcohol);
  const totalCaffeine = calculateDrinkTotals(drinkData?.Caffeine);

  return (
    <>
      <div
        className="select-date"
        style={{ backgroundImage: `url(${IMAGES.bgSelectDate})` }}
      >
        <h3 className="selectDate-header">{LABEL.SELECT_DATE}</h3>
        <input
          type="Date"
          max={dateFunction}
          className="date-input"
          value={selectDate}
          onChange={(e) => setSelectDate(e.target.value)}
        />

        <br />
      </div>

      <Table
        logData={logData}
        showFeature={false}
        handleNutritionModal={() => {}}
        handleEditLog={() => {}}
        handleDeleteLog={() => {}}
      />

      <h2 style={{ marginRight: "1%", marginTop: "5vh", fontSize: "2rem" }}>
        {" "}
        {FORM.TOTAL_CALORIE_CONSUMED}
        {totalCalories} {FORM.KCAL}
      </h2>
      <div className="reports-chart">
        <Doughnut
          data={chartData}
          style={{
            marginRight: "20px",
            marginTop: "30px",
            height: "auto",
            width: "50%",
          }}
        ></Doughnut>
        <div className="dashboard-text">
          {chartData.labels.map((label, index) => {
            const value = chartData.datasets[0].data[index];
            const percentage =
              value > 0 ? Math.floor(getPercentage(value, total)) : 0;
            return (
              <div key={index} className="dashboard-text-item">
                <strong>{label}:</strong> {value} {FORM.KCAL} ({percentage}%)
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 style={{ marginRight: "1%", marginTop: "5vh", fontSize: "2rem" }}>
          {" "}
          {LABEL.DRINK_REPORT}
        </h2>
        <DrinkTable
          showAction={false}
          totalWater={totalWater}
          totalAlcohol={totalAlcohol}
          totalCaffeine={totalCaffeine}
        />
      </div>
    </>
  );
};

export default Reports;
