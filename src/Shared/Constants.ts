const ROUTES = {
    HOMEPAGE: '/',
    LOGIN: '/login',
    REGISTER: '/signup',
    ABOUT: '/about-us',
    CALORIE_CALCULATOR: '/calorie-calculator',
    USER_INFO: '/userinfo',
    INPUT_WEIGHT: '/input-weight',
    INPUT_WORKOUT: '/input-workout',
    CALORIE_NEED: '/calorie-need',
    CONTACT: '/contact',
    DASHBOARD: '/dashboard',
    REPORTS: '/reports',
    IMAGE_SEARCH: '/image-search',  
    RESET_PASSWORD: '/reset-password',
    EMAIL_VERIFICATION: '/email-verfication'
  };
  

const WILDCARD_ROUTES = {
    PUBLIC: ROUTES.HOMEPAGE,
    PRIVATE: ROUTES.LOGIN,
    title : 'Rendering wildcard'
  };
  
  const ROUTES_CONFIG = {
    HOMEPAGE: {
      path: ROUTES.HOMEPAGE,
      title: 'Home',
    },
    LOGIN: {
      path: ROUTES.LOGIN,
      title: 'Login',
    },
    REGISTER: {
      path: ROUTES.REGISTER,
      title: 'Register',
    },
    ABOUT: {
      path: ROUTES.ABOUT,
      title: 'About us',
    },
    CALORIE_CALCULATOR: {
      path: ROUTES.CALORIE_CALCULATOR,
      title: 'BMR Calculator',
    },
    USER_INFO: {
      path: ROUTES.USER_INFO,
      title: 'User Info',
    },
    INPUT_WEIGHT: {
      path: ROUTES.INPUT_WEIGHT,
      title: 'Input Weight',
    },
    INPUT_WORKOUT: {
      path: ROUTES.INPUT_WORKOUT,
      title: 'Input Workout',
    },
    CALORIE_NEED: {
      path: ROUTES.CALORIE_NEED,
      title: 'Calorie Need',
    },
    CONTACT: {
      path: ROUTES.CONTACT,
      title: 'Contact Us',
    },
    DASHBOARD: {
      path: ROUTES.DASHBOARD,
      title: 'Dashboard',
    },
    REPORTS: {
      path: ROUTES.REPORTS,
      title: 'Reports',
    },
    IMAGE_SEARCH: {
      path: ROUTES.IMAGE_SEARCH,
      title: 'Image Search',
    },
    RESET_PASSWORD: {
      path: ROUTES.RESET_PASSWORD,
      title: 'Reset Password',
  },
  EMAIL_VERIFICATION:{
    path: ROUTES.EMAIL_VERIFICATION,
    title: 'Email Verification'
  }
} 
  export { WILDCARD_ROUTES, ROUTES_CONFIG };

  
  export  const  CONTAINER_OPTION ={
           SMALLGLASS:'Small Glass (100ml)',
           MEDIUMGLASS:'Medium Glass (175ml)',
           LARGEGLASS :'Large Glass (250ml)',
           SMALL_QUANTITY:100,
           MEDIUM_QUANTITY:175,
           LARGE_QUANTITY:275,
  }

  export const ACTIVITY_OPTIONS = {
    SEDENTARY: { value: 1.2, label: "Sedentary (little to no exercise)" },
    LIGHTLY_ACTIVE: { value: 1.375, label: "Lightly active (light exercise 1-3 days/week)" },
    MODERATELY_ACTIVE: { value: 1.55, label: "Moderately active (moderate exercise 3-5 days/week)" },
    VERY_ACTIVE: { value: 1.725, label: "Very active (hard exercise 6-7 days/week)" },
    EXTRA_ACTIVE: { value: 1.9, label: "Extra active (very hard exercise or a physical job)" },
  };
  

// constants.ts
export const ACTIVITY= {

  SEDENTRY:'Sedentary (little to no exercise)',
  LIGHTLY_ACTIVE:"Lightly active (light exercise 1-3 days/week)",
  MODERATELY_ACTIVE:"Moderately active (moderate exercise 3-5 days/week)",
  VERY_ACTIVE:"Very active (hard exercise 6-7 days/week)",
  EXTRA_ACTIVE: "Extra active (very hard exercise or a physical job)",
}

  export  const COLSPAN_VALUE = 6;


  export const  MEALTYPE ={
    BREAKFAST:'Breakfast',
    LUNCH:'Lunch',
    DINNER:'Dinner',
    SNACK:'Snack'
  }

  export const DRINK_TYPE={
    WATER:'Water',
    ALCOHOL:'Alcohol',
    CAFFEINE:'Caffeine'
  }
 export const  IMAGE_ID_API_URL   = 'https://api.logmeal.com/v2/image/segmentation/complete'

 export const  NUTRI_INFO_API_URL = 'https://api.logmeal.com/v2/nutrition/recipe/nutritionalInfo'


 export const  GROUP_OPTIONS = {
  COMMON_LABEL :"Common Foods",
  BRANDED_LABEL :"Branded Foods",
  COMMON_CATEGORY: "Common",
  BRANDED_CATEGORY:"Branded"
 }


export const  HEIGHT_VALIDATION={
REQUIRED:'Height is required',
POSITIVE:'Height must be positive',
INTEGER:'Height must be a whole number',
NUMBER:'Height must be a number'
}

export const AGE_VALIDATION={
REQUIRED:'Age is required',
POSITIVE:'Age must be positive',
INTEGER:'Age must be a whole number',
NUMBER:'Age must be a number'
}

export const WEIGHT_VALIDATION={
  REQUIRED:'Weight is required',
  POSITIVE:'Weight must be positive',
  INTEGER:'Weight must be a whole number',
  NUMBER:'Weight must be a number',
  CURRENT_WEIGHT: {
    TYPE_ERROR: "Must be a number",
    MIN: "Current weight must be at least 1 kg.",
    REQUIRED: "Please enter your current weight.",
  },
  TARGET_WEIGHT: {
    TYPE_ERROR: "Must be a number",
    MIN: "Target weight must be at least 1 kg.",
    REQUIRED: "Please enter your target weight.",
  },
}
export const QUANTITY_VALIDATION = {
  REQUIRED: "Please enter a quantity",
  POSITIVE: "Quantity must be a positive number",
  INTEGER: "Quantity must be a whole number",
  NUMBER: "Quantity must be a number",
};


export const WEIGHT={
  LOOSE_WEIGHT:'Loose Weight',
  GAIN_WEIGHT:'Gain Weight',
  MAINTAIN_WEIGHT:'Maitain Weight',
  LOOSE_WEIGHT_DESCRPTION:'Lose 0.5 kg weight/week',
  GAIN_WEIGHT_DESCRIPTION:'Gain 0.5 kg weight/week'


}

export const GOAL_OPTIONS = {
  LOOSE_WEIGHT: { value: "Loose Weight", label: "Loose Weight" },
  GAIN_WEIGHT: { value: "Gain Weight", label: "Gain Weight" },
  MAINTAIN_WEIGHT: { value: "Maintain Weight", label: "Maintain Weight" },
};




export const  FIREBASE_DOC_REF={
  USER:'users',
  DAILY_LOGS:'dailyLogs'
}

export const VALIDATION={
  QUANTITY:'quantity',
  SELECT_QUANTITY:'selectquantity',
  SELECT_CATEGORY:'selectCategory',
  SELECT_CONTAINER:'Select a container type',
  SELECT_DRINK_TYPE:'Select a drink type',
  ENTER_QUANTITY:'Enter Quantity',
  SELECT_ALL:'Please Select all the fields',
  SELECT_OPTION:'Select an option'
}



export const CALCULATE_NUTRI={
  CALORIE:"nf_calories"
}

export const NUTRIENT={
  CALORIE: 'calories',
  PROTEIN: 'proteins',
  CARBS:'carbs',
  FATS:'fats',
  CALORIE_KCAL: 'Calories (Kcal)',
  PROTEIN_GM: 'proteins (g)',
  CARBS_GM:'carbs (g)',
  FATS_GM:'fats(g)',
  NF_CALORIES:"nf_calories",
  

}


export const GENDER_OPTION={
  MALE:'Male',
  FEMALE:'Female'
}

