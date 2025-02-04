import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
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
import { ERROR_MESSAGES, FORM, IMAGES, LABEL } from "../../Shared";
import Table from "../../Components/Shared/Table";
import { LogData } from "../Dashboard/Dashboard";
import { FIREBASE_DOC_REF, MEALTYPE } from "../../Shared/Constants";
import colors from "../../assets/Css/color";



const Reports: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logData, setLogdata] = useState<LogData | undefined>();
  const [selectDate, setSelectDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
 
  // Loader from Redux
  const loader = useSelector((state: RootState) => state.Loader.loading);

  // Fetch User Data from Firestore
  const handleGetData = async (user: User | null) => {
    try {
      dispatch(showLoader());
      if (!user) {
        dispatch(hideLoader());
        return;
      }
      const userId = user.uid;
      const date = selectDate;
      const docRef = doc(db, FIREBASE_DOC_REF.USER, userId, FIREBASE_DOC_REF.DAILY_LOGS, date);

      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const mealData = docSnap.data() as LogData;
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
  }, [selectDate]);

  // Calculate meal calories
  const calculateMealCalories = (mealData?: { calories: number }[]): number => {
    return mealData?.length 
      ? mealData.reduce((total, item) => total + item.calories, 0)
      : 0;
  };

  // Calorie calculations
  const breakfastCalorie = calculateMealCalories(logData?.Breakfast);
  const lunchCalorie = calculateMealCalories(logData?.Lunch);
  const snackCalorie = calculateMealCalories(logData?.Snack);
  const dinnerCalorie = calculateMealCalories(logData?.Dinner);

  const totalCalories =
    breakfastCalorie + lunchCalorie + snackCalorie + dinnerCalorie;

  // Set the donut chart data
  const chartData = {
    labels: [MEALTYPE.BREAKFAST,MEALTYPE.LUNCH, MEALTYPE.SNACK, MEALTYPE.DINNER],
    datasets: [
      {
        data: [breakfastCalorie, lunchCalorie, snackCalorie, dinnerCalorie],
        backgroundColor: [
          colors.berakfast_color,
          colors.lunch_color,
          colors.snacks_color,
          colors.dinner_color
        ],
        hoverOffset: 1,
      },
    ],
  };

  return (
    <>
      <div
        className="select-date"
          style={{ backgroundImage: `url(${IMAGES.bgSelectDate})` }}
      >
        <h3 className="selectDate-header">{LABEL.SELECT_DATE}</h3>
        <input
          type="Date"
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
        {FORM.TOTAL_CALORIE_CONSUMED}{totalCalories} {FORM.KCAL}
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

            return (
              <div key={index} className="dashboard-text-item">
                <strong>{label}:</strong> {value} {FORM.KCAL}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Reports;