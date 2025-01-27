const ROUTES = {
    HOMEPAGE: '/',
    LOGIN: '/login',
    REGISTER: '/register',
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
  };
  

const WILDCARD_ROUTES = {
    PUBLIC: ROUTES.HOMEPAGE,
    PRIVATE: ROUTES.LOGIN,
  };
  
  const ROUTES_CONFIG = {
    HOMEPAGE: {
      path: ROUTES.HOMEPAGE,
      title: 'Landing Page',
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
      title: 'Calorie Calculator',
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
} 
  export { WILDCARD_ROUTES, ROUTES_CONFIG };

  export interface User {
    id: number;
    email: string;
    isActive: boolean;
  }
  


  export  const  CONTAINEROPTION ={
           SMALLGLASS:'Small Glass (100ml)',
           MEDIUMGLASS:'Medium Glass (175ml)',
           LARGEGLASS :'Large Glass (250ml)'
  }