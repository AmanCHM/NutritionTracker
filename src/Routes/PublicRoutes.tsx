import React from 'react';
import { Navigate } from 'react-router-dom';

import { CustomRouter } from './RootRoutes';
import { ROUTES_CONFIG, WILDCARD_ROUTES } from '../Shared/Constants';
import Home from '../Views/Home/Home';


import Login from '../Views/Auth/Login';
import SignUp from '../Views/Auth/SignUp';
import ResetPassword from '../Views/Auth/ResetPassword';
import About from '../Views/About';
import Contact from '../Views/Contact';
import UserInfo from '../Views/CalorieRecommendation/StepOne/UserInfo';
import CalorieRecommendation from '../Views/CalorieRecommendation/CalorieRecommedation';
import ExerciseInput from '../Views/CalorieRecommendation/StepThree/ExerciseInput';
import WeightInput from '../Views/CalorieRecommendation/StepTwo/WeightInput';

export const PUBLIC_ROUTES: Array<CustomRouter> = [
  {
    path: `${ROUTES_CONFIG.HOMEPAGE.path}`,
    element: <Home/>,
    title: ROUTES_CONFIG.HOMEPAGE.title,
  },
   {
    path: `${ROUTES_CONFIG.LOGIN.path}`,
    title: ROUTES_CONFIG.LOGIN.title,
    element: <Login/>,
  },
  {
    path: `${ROUTES_CONFIG.REGISTER.path}`,
    title: ROUTES_CONFIG.REGISTER.title,
    element: <SignUp />,
  },
  {
    path: `${ROUTES_CONFIG.RESET_PASSWORD.path}`,
    title: ROUTES_CONFIG.RESET_PASSWORD.title,
    element: <ResetPassword />,
  },
  {
    path: `${ROUTES_CONFIG.ABOUT.path}`,
    title: ROUTES_CONFIG.ABOUT.title,
    element: <About />,
  },

  {
    path: `${ROUTES_CONFIG.CONTACT.path}`,
    title: ROUTES_CONFIG.CONTACT.title,
    element: <Contact />,
  },
  {
    path: `${ROUTES_CONFIG.USER_INFO.path}`,
    title: ROUTES_CONFIG.USER_INFO.title,
    element: <UserInfo />,
  },
  {
    path: `${ROUTES_CONFIG.INPUT_WEIGHT.path}`,
    title: ROUTES_CONFIG.INPUT_WEIGHT.title,
    element: <WeightInput/>,
  },
  {
    path: `${ROUTES_CONFIG.INPUT_WORKOUT.path}`,
    title: ROUTES_CONFIG.INPUT_WORKOUT.title,
    element: < ExerciseInput/>,
  },
  {
    path: `${ROUTES_CONFIG.CALORIE_NEED.path}`,
    title: ROUTES_CONFIG.CALORIE_NEED.title,
    element: <CalorieRecommendation />,
  },
  {
    path: '*',
    element: <Navigate to={WILDCARD_ROUTES.PUBLIC} />,
    title: 'Rendering wildcard',
  },
];