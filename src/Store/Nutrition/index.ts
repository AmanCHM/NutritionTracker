import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
  userName: string;
  height: string;
  gender: string;
  age: string;
}

interface GoalInfo {
  currentWeight: string;
  targetWeight: string;
  goal: string;
  weightDifference: number;
}

interface CalorieGoalState {
  userName: string;
  currentWeight: string;
  targetWeight: string;
  height: string;
  gender: string;
  age: string;
  activity: string;
  requiredCalorie: number;
  goal: string;
  waterIntake: number;
  weightDifference: number;
  showrecommendation: boolean;
}

const initialState: CalorieGoalState = {
  userName: "",
  currentWeight: "",
  targetWeight: "",
  height: "",
  gender: "",
  age: "",
  activity: "",
  requiredCalorie: 0,
  goal: "",
  waterIntake: 0,
  weightDifference: 0,
  showrecommendation: false,
};

const nutrition = createSlice({
  name: "nutrition",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      const { userName, height, gender, age } = action.payload;
      state.userName = userName || state.userName;
      state.height = height || state.height;
      state.gender = gender || state.gender;
      state.age = age || state.age;
    },

    updateGoal: (state, action: PayloadAction<GoalInfo>) => {
      const { currentWeight, targetWeight, goal, weightDifference } = action.payload;
      state.currentWeight = currentWeight || state.currentWeight;
      state.targetWeight = targetWeight || state.targetWeight;
      state.goal = goal || state.goal;
      state.weightDifference = weightDifference || state.weightDifference;
    },

    setActivityLevel: (state, action: PayloadAction<string>) => {
      state.activity = action.payload;
    },

    setRequiredCalorie: (state, action: PayloadAction<number>) => {
      state.requiredCalorie = action.payload;
    },

    openCalorieModal: (state) => {
      state.showrecommendation = true;
    },

    closeCalorieModal: (state) => {
      state.showrecommendation = false;
    },
    
    resetGoal: () => initialState,
  },
});

export const {
  setUserInfo,
  updateGoal,
  setActivityLevel,
  setRequiredCalorie,
  resetGoal,
  openCalorieModal,
  closeCalorieModal,
} = nutrition.actions;
export default nutrition.reducer;