import React from 'react';
import { Navigate } from 'react-router-dom';

import { CustomRouter } from './RootRoutes';
import { ROUTES_CONFIG, WILDCARD_ROUTES } from '../Shared/Constants';

export const PUBLIC_ROUTES: Array<CustomRouter> = [
  {
    path: `${ROUTES_CONFIG.HOMEPAGE.path}`,
    element: '<Home />',
    title: ROUTES_CONFIG.HOMEPAGE.title,
  },
   {
    path: `${ROUTES_CONFIG.LOGIN.path}`,
    title: ROUTES_CONFIG.LOGIN.title,
    // element: <Login />,
  },
  {
    path: `${ROUTES_CONFIG.REGISTER.path}`,
    title: ROUTES_CONFIG.REGISTER.title,
    // element: <Register />,
  },
  {
    path: `${ROUTES_CONFIG.RESET_PASSWORD.path}`,
    title: ROUTES_CONFIG.RESET_PASSWORD.title,
    // element: <ResetPassword />,
  },
  {
    path: `${ROUTES_CONFIG.ABOUT.path}`,
    title: ROUTES_CONFIG.ABOUT.title,
    // element: <About />,
  },
  {
    path: '*',
    element: <Navigate to={WILDCARD_ROUTES.PUBLIC} />,
    title: 'Rendering wildcard',
  },
];