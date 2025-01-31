import { ROUTES_CONFIG } from "../Shared/Constants";
import Login from "../Views/Auth/Login";
import ResetPassword from "../Views/Auth/ResetPassword";
import SignUp from "../Views/Auth/SignUp";
import Home from "../Views/Home/Home";
import { CustomRouter } from "./RootRoutes";
import React from "react";

export const  GUEST_ROUTES: Array<CustomRouter> = [           


    {
        path: `${ROUTES_CONFIG.HOMEPAGE.path}`,
        title: ROUTES_CONFIG.HOMEPAGE.title,
        element: <Home />,
      },
      {
        path: `${ROUTES_CONFIG.LOGIN.path}`,
        title: ROUTES_CONFIG.LOGIN.title,
        element: <Login />,
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
    ]