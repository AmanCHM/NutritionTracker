import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
  userName: string;
  height: number;
  gender: string;
  age: number;
}

interface GoalInfo {
  currentWeight: number;
  targetWeight: number;
  goal: string;
  weightDifference: number;
}

interface CalorieGoalState {
  userName: string;
  currentWeight: number;
  targetWeight: number;
  height: number;
  gender: string;
  age: number;
  activity: string;
  requiredCalorie: number;
  goal: string;
  waterIntake: number;
  weightDifference: number;
  showrecommendation: boolean;
}

const initialState: CalorieGoalState = {
  userName: "",
  currentWeight: 0,
  targetWeight: 0,
  height: 0,
  gender: "",
  age: 0,
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