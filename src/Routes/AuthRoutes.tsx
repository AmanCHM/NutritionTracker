import React from 'react';
import { ROUTES_CONFIG } from '../Shared/Constants';
import { CustomRouter } from './RootRoutes';
import Login from '../Views/Auth/Login';
import SignUp from '../Views/Auth/SignUp';
import ResetPassword from '../Views/Auth/ResetPassword';


const AUTH_ROUTES: Array<CustomRouter> = [
  {
    path: `${ROUTES_CONFIG.LOGIN.path}`,
    title: ROUTES_CONFIG.LOGIN.title,
    element: <Login/>,
  },
  {
    path: `${ROUTES_CONFIG.REGISTER.path}`,
    title: ROUTES_CONFIG.REGISTER.title,
    element: <SignUp/>, 
  },
  {
    path: `${ROUTES_CONFIG.RESET_PASSWORD.path}`,
    title: ROUTES_CONFIG.RESET_PASSWORD.title,
    element: <ResetPassword/>,
  },
];

export default AUTH_ROUTES;