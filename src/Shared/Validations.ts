import { NUTRIENT } from "./Constants";

export const FORM_VALIDATION_MESSAGES = (...args: string[]) => ({
  REQUIRED: "This is required.",
  MIN_LENGTH: `This input required minimum (${args[0]}) character`,
  MAX_LENGTH: `This input exceeded maxLength (${args[0]})`,
  VALID_EMAIL: "Please enter the valid email",
  VALID_PASSWORD: "Password must contain atleast 8 characters .",
  VALID_USERNAME:
    "Use a username between 5 to 18 lowercase alphanumeric characters, special characters and spaces are not allowed.",
  CONFIRM_PASSWORD: "Your passwords do not match",
  VIDEO_NAME:
    "Use a filename between 5 to 18 alphanumeric characters, special characters are not allowed.",
  VALID_LINK: "Please enter valid link.",
  ANSWER_REQUIRED: "Please add your answer to join this squad",
  LONDER_ANSWER_REQUIRED: "Please provide a longer answer",
  MAX_NUMBER: `Maximum value should be less than (${args[0]})`,
  NAME_REQUIRED: "Name is required.",
  GENDER_REQUIRED: "Gender is required.",
  ERROR_OCCURED: "An error occurred. Please try again later.",
  VALID_QUANTITY: "Please enter a valid quantity.",
  SELECT_QUANTITY: "Please select a quantity.",
  VALID_SERVING_SIZE: "Please select serving size.",
  CHOOSE_MEAL_CATEGORY: "Please choose a meal category.",
  CONTAINER_SELECT: "Please select a container type",
  DRINK_SELECTOR: "Please select a drink type.",
  USER_NOT_AUTHENTICATED: "User is not authenticated",
});

export const VALIDATION_REGEX = {
  EMAIL: /^\S+@\S+\.\S+$/, // Validates basic email structure
  NUMBER: /\d+/g, // Matches any sequence of digits
  SPECIAL_CHARACTERS_NOT_ALLOWED: /^[a-zA-Z0-9\s]+$/, // Allows only alphanumeric characters and spaces
  SPECIAL_CHARACTERS_AND_SPACES_NOT_ALLOWED: /^[a-zA-Z0-9]+$/, // Allows only alphanumeric characters
  // VALID_LINK: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&=]*)$/,
  USERNAME: /^[a-z0-9]+$/, // Allows only lowercase letters and digits
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};
export const ERROR_MESSAGES = (...args: string[]) => ({
  REQUIRED: `This field is required ${args[0]}`,
  SOMETHING_WENT_WRONG: "Sorry, something went wrong.",
  INVALID_OTP: "Please enter a valid OTP.",
  UNAUTHORISED_ACCESS: "Unauthorised access.",
  INVALID_EMAIL: "Invalid email address",
  GOOGLE_SIGNEDUP_FAIL: "Google Sign-Up Failed",
  GOOGLE_LOGIN_FAILED: "Google Login failed",
  EMAIL_NOT_REGISTERED: "Email not registered",
  ERROR_SAVING_DATA: "Failed to save  data.",
  USER_NOT_AUTHENTICATED: "User not authenticated. Please log in.",
  CALORIE_NOT_SAVED: "No calorie data to save. Please calculate first",
  ERROR_FETCH: "Error fetching data",
  FAILED_DRINK_ADD: "Failed to add drink details.",
  UPDATE_FAILED: "Failed to update drink details.",
  UPLOAD_FOOD_IMAGE: "Please upload a valid food image",
  NOT_FOUND: "No data found for the specified drink type.",
  ITEM_NOT_DELETED: "Item not Deleted",
  MEAL_NOT_FOUND: "Meal data not found",
  NOT_DEFINED: "Item not defined",
  SELECT_ACTIVITY_LEVEL: "Please select an activity level!",
  TARGET_LESS_THAN_CURRENT:
    "Target weight must be less than current weight for weight loss.",
  TARGET_MORE_THAN_CURRENT:
    "Target weight must be greater than current weight for weight gain.",
  TARGET_EQUAL: '"Target weight must equal current weight for maintenance."',
});

export const SUCCESS_MESSAGES = (...args: string[]) => ({
  REQUIRED: `This field is required ${args[0]}`,
  PASSWORD_RESET_SUCCESSFULLY:
    "Password reset successfully. Please login to continue.",
  EMAIL_SENT: "Email sent",
  LOGGED_IN_SUCCESSFULLY: "Logged in successfully.",
  LOGGED_IN_UNSUCCESS: "Login not successful",
  SIGNED_UP_SUCCESSFULLY: "SignedUp Successfully",
  SIGNED_UP_NOT_SUCCESSFULLY: "SignUp not successful",
  GOOGLE_SIGNEDUP_SUCCESS: "Google Sign-Up Successful",
  GOOGLE_LOGIN_SUCCESS: "Google Logged in successful",
  CALORIE_SAVED_SUCCESSFULLY: "Calorie data saved successfully.",
  SET_CALORIE: "Your calorie is set",
  SUCCESS_ITEM_DELETED: "Successfully item deleted",
  SUCCESS_ITEM_ADD: "Successfully item added",
  SUCCESS_DRINK_ADDED: "Drink details added successfully!",
  ITEM_EDIT_SUCCESS: "Item edited successfully",
});

export const ABOUT = {
  HEADER: "About Nurtition Tracker",
  FIRST_PARA_HEADER: "Who We Are",
  FIRST_PARA:
    "At Nutrition Tracker, we are passionate about empowering individuals to lead healthier lives through informed dietary choices. Our app is designed to provide personalized nutrition insights and an intuitive way to track your daily calorie and nutrient intake.",
  SECOND_PARA_HEADER: "Our Story",
  SECOND_PARA:
    "Nutrition Tracker was born from the idea that understanding what you eat shouldn't be complicated. With a team of health enthusiasts,developers, and nutrition experts, we set out to create a solution that simplifies meal tracking and fosters better eating habits.",

  THIRD_PARA_HEADER: "Meet Our Team",
  THIRD_PARA:
    " Our dedicated team of developers, nutritionists, and designers is committed to helping you achieve your health goals. Together, we innovate, inspire, and create a better way to live healthier.",
  LIST_TITLE: "Our Values",
  OUR_STORY_TITLE: "Our Story",
  OUR_STORY_PARA:
    " Nutrition Tracker was born from the idea that understanding what you eat shouldn't be complicated. With a team of health enthusiasts,  developers, and nutrition experts, we set out to create a solution that simplifies meal tracking and fosters better eating habits.",

  VALUE: [
    "Encouraging Balanced Nutrition",
    "Empowering Users with Knowledge",
    "Fostering a Health-Conscious Community",
    "Prioritizing Data Privacy and Security",
  ],
};

export const LABEL = {
  APP_TITLE:'Nutrition Tracker',
  SUBMIT: "Submit",
  PASSWORD: "Password",
  EMAIL: "Email Address",
  LOG_IN: "Log-in",
  SIGN_IN_GOOGLE: "Sign in with Google",
  FORGOT_PASS: "Forget your password?",
  RESET_PASS: "Reset-Password",
  DONT_HAVE_ACC: "Dont have an account?",
  SIGN_UP: "Sign Up",
  GO_TO_LOGIN: "Go to login page",
  CONFIRM_PASS: "Confirm Password",
  ALREADY_ACC: "Already have an account?",
  ENTER_NAME: "Enter Your Name",
  SELECT_ATIVITY: "Select Activity",
  SELECT_GOAL: "Select Goal:",
  SELECT_GOAL_HEAD: "Select your goal and provide your target weights.",
  RECOMMENDED_CALORIE: "Recommended Calories",
  KCAL_PER_DAY: "kcal/day",
  NAME: "Name:",
  EMAIL_LABEL: "Email",
  MESSAGE: "Message",
  SEND: "Send",
  CONTACT: "Contact us",
  SELECT_DATE: "Select Date",
  DRINK_PROGRESS:'Today`s Drink Progress Report',
  MEAL_PROGRESS: 'Today Meal Progress Report',
  ADD_DRINK:'Add Drink',
  DRINK_TYPE:'Drink Type:',
  CONTAINER_TYPE:'Container Type',
  QUANTITY:'Quantity',
  CLOSE: 'X',
  RECO_FOOD:'Recognize Food Facts',
  UPLOAD:'Upload',
  NUTRI_INFO:'Nutrition Information',
  NUTRIENT:'Nutrient',
  CHOOSE_MEAL:'Choose Meal',
  CHOOSE_QUANTITY:'Choose Quantity',
  ADD_MEAL:' Add Meal',
  CALORIE_SERVED:' Calorie Served:',
  SELECT_MEAL:'Select Meal',
  SERVING_SIZE:'Select Serving Size',
  NUTRI_FACTS:'Nutritional Facts',
  AMOUNT:'Amount',
  CLOSE_TEXT:'Close',
  CALORIE_REQUIREMENT:' Your Calorie Requirements',
  YOUR_GOAL:'Your Goal:',
  SET_CALORIE:'Set Calorie',
  CUSTOMISE_NUTRI_PLAN:'Customize your nutrition plan manually:',
  CLICK_HERE:'click here',
  NO_ITEM_AVAILABLE:'No items available',
  UPDATE: 'Update',
  DETAILS:'Details',
  DRINK_SIZE:'Drink Size',
  DRINK_QUANTITY:'Drink Quantity (ml)',
  ACTION:'Action',
  UPDATE_MEAL:'Update Meal',
  SEARCH_MEAL:'Search Your Meals Below',
  OR:'or',
  AI_FOOD_VISION:' AI Food Vision: Identify Your Dish Instantly',
  AI_VISUAL_SEARCH:' AI Visual Food Search',
  YOUR_TODAY_MEAL:'Your Calorie Journey Today',
  WATER_AND_BEVERAGE:'Water and Beverages Intake',
  DRINK:'Drink',
  FOOTER_APP_DESCRIPTION:'Simply #1 Health & Diet Tracking Platform',
  QUICK_LABEL:'Quick Links',
  COPY_RIGHT:'2024 Nutrition Tracker | All rights reserved.',
  FALLBACK_LABEL:'Our website is currently experiencing technical issues. Rest assured, weare on it! Thank you for your patience.',
  LOOSE:'loose',
  GAIN:'gain',
  LOSE_RECOMMENDATION:'to lose  0.5 kg weight/week ',
  GAIN_RECOMMENDATION:'to Gain  0.5 kg weight/week ',
  MAINTAIN_RECOMMENDATION:'to maintain weight',
  LOGOUT_WARNING:'Are you sure ! you want to logout?',
  LOGOUT_OPTION:'Yes, Logout',
  LOGOUT_CANCEL:'Cancel',
  FOOD_NAME:'Food Name',
  FOOD_DIARY:'Your Food Diary',
  NO_BREAKFAST:'No breakfast items',
 NO_LUNCH:'No lunch items',
 NO_SNACKS:'No Snack items',
 NO_DINNER:'No Dinner items',
};


export const CONTACT_DETAILS = {
  TITLE: "Contact Us",
  ADDRESS: ["439B Health Avenue", "Varanasi, India"],
  PHONE: {
    ICON: "fas fa-phone-alt",
    NUMBER: "+91 987 373 4838",
  },
  EMAIL: {
    ICON: "fas fa-envelope",
    ADDRESS: "aman.kumar@gmail.com",
  },
};

export const SET_DRINKS_CALORIE = {
  CALORIE: 2000,
  WATER: 3000,
  ALOCOHOL: 600,
  CAFFEINE: 850,
};

export const MEAL_TERMS = {
  DAILY_ENERGY_INTAKE: "Calculate Your Daily Energy Intake",
};

export const USER = {
  HEIGHT: "Height (cm):",
  WEIGHT: "Weight (kg):",
  AGE: "Age (years):",
  ACTIVITY: "Activity Level:",
  GENDER: "Gender:",
  CURR_WEIGHT: "Current Weight (kg)",
  TARGET_WEIGHT: "Target Weight (kg)",
};

export const FORM = {
  DAILY_ENERGY_INTAKE: "Calculate Your Daily Energy Intake",
  CALCULATE: "Calculate",
  SET_DAILY_MEAL: "Set Your Daily Meal",
  TOTAL_CALORIE_CONSUMED: "Total Calorie Consumed :",
  KCAL: "Kcal",
  ML:'ml',
  GM:'g'
};

export const GREETINGS = {
  WELCOME_NUTRITRACK: "Welcome to Nutrition Tracker",
  HAPPY_GREET: "We’re happy you’re here.",
  INFO_GREET: "Let’s get to know a little about you.",
  ACTIVITY_LABEL: " What is your baseline activity level?",
  WORKOUT_LABEL: "Not including workouts–we count that separately",
  GOAl_GREET: "Thanks! Now for your goals.",
  WEEKLY_GOAL: "What is your weekly goal?",
  WEEKLY_HEALTH:
    "Lets break down your overall health goal into a weekly one you can maintain.",
  SLOW_AND_STEADY_BEST: "Slow-and-steady is best!",
  CALORIE_REQUIREMENT: ", Your Calorie Requirements",
  GREET: "Hi!",
  TRACK_MEALS: "Track your meals and stay healthy!",
  EAT_SMARTER: " Eat smarter,",
  LIVE_BETTER: "Live better.",
  TRACK_CALORIE: "Track your calories, exercise,",
  BIOMETRIC_DATA: "biometrics and health data.",
  LET_START: "Lets Start",
  NUTRI_PLAN_GREET:'  Start your path to a healthier you today. Let’s create a personalized plan tailored just for you!'
};

export const HOME_PAGE = {
  AI_FEATURE: {
    INTRO: " Introducing  AI Feature",
    GREET:
      "Nutrition tracker encourages you to not just count your calories but to focus on your nutrition as a whole",
    CARD_HEADER: "Instant Food Recognition",
    CARD_DESCRIPTION:
      "Simply upload a food photo and get the nutritional information of your meal.Our App is powered by our Food AI API. Food AI API is based on the latest innovations in deep learning and image classification technology to quickly and accurately identify food items.",
  },
  APP_FEATURE: {
    LABEL: " Improve your nutrition with confidence.",
    GREET:
      " Nutrition tracker encourages you to not just count your calories but to focus on your nutrition as a whole",
    FIRST_CARDS: {
      HEADER: "Accurate nutrition data",
      DESCRITION:
        "Be confident that the food you log has the correct nutrition data. We verify every food submission for accuracy.",
    },
    SECOND_CARDS: {
      HEADER: "Over many users",
      DESCRITION:
        "Join the community to get tips and inspiration from other users on our forums and Facebook ",
    },
    THIRD_CARDS: {
      HEADER: "Data privacy & security",
      DESCRITION:
        "We take the security of our users accounts seriously - we will never sell your account data to third parties.",
    },
  },

  APP_OVERVIEW:{
 LABEL:'App Overview:Develop healthy habits',
  DESCRIPTION :' Count your calories, ensure you are meeting nutrient targets, and see your progress over time.'
,
 
    FIRST_CARDS: {
      HEADER: "Track up to 82 micronutrients",
      DESCRIPTION: "Log your meals and track all your macro and micronutrients.",
    },
    SECOND_CARDS: {
      HEADER: "Valuable reports and charts",
      DESCRIPTION: "Learn how nutrients and biometrics correlate over time.",
    },
    THIRD_CARDS: {
      HEADER: "Log meals, exercise and biometrics",
      DESCRIPTION:
        "Plus, you can create custom foods, recipes, exercises and biometrics!",
    },
    FOURTH_CARDS: {
      HEADER: "Track up to 82 micronutrients",
      DESCRIPTION: "Log your meals and track all your macro and micronutrients.",
    },
    FIFTH_CARDS: {
      HEADER: "AI enabled Image-search",
      DESCRIPTION:
        "Search meals via image & track all your macro and micronutrients.",
    },
    SIXTH_CARDS: {
      HEADER: "Track up to 82 micronutrients",
      DESCRIPTION: "Log your meals and track all your macro and micronutrients.",
    },
  }
  
    };
    


