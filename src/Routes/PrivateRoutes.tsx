
import { ROUTES_CONFIG, WILDCARD_ROUTES } from '../Shared/Constants';
import { CustomRouter } from './RootRoutes';
import { Navigate } from 'react-router-dom';
import React from 'react';
import Dashboard from '../Views/Dashboard';
import About from '../Views/About';
import CalorieCalculator from '../Views/BMRCalculator';

import Home from '../Views/Home';
import Reports from '../Views/Reports';
import Contact from '../Views/Contact';
import EmailVerificationPage from '../Views/Auth/SignUp/EmailVerification/EmailVerificationPage';




// eslint-disable-next-line import/prefer-default-export
export const PRIVATE_ROUTES: Array<CustomRouter> = [
  {
    path: ROUTES_CONFIG.DASHBOARD.path,
    element: <Dashboard />,
    title: ROUTES_CONFIG.DASHBOARD.title,
  },
  {
    path: ROUTES_CONFIG.ABOUT.path,
    element: <About />,
    title: ROUTES_CONFIG.ABOUT.title,
  },
  {
    path: ROUTES_CONFIG.CALORIE_CALCULATOR.path,
    element: <CalorieCalculator />,
    title: ROUTES_CONFIG.CALORIE_CALCULATOR.title,
  },
  {
    path: ROUTES_CONFIG.REPORTS.path,
    element: <Reports />,
    title: ROUTES_CONFIG.REPORTS.title,
  },
  {
    path: ROUTES_CONFIG.HOMEPAGE.path,
    element: <Home />,
    title: ROUTES_CONFIG.HOMEPAGE.title,
  },
  {
    path: ROUTES_CONFIG.CONTACT.path,
    element: <Contact />,
    title: ROUTES_CONFIG.CONTACT.title,
  },
  {
    path: `${ROUTES_CONFIG.EMAIL_VERIFICATION.path}`,
    title: ROUTES_CONFIG.EMAIL_VERIFICATION.title,
    element: <EmailVerificationPage/>
  },
  {
    path: '*',
    element: <Navigate to={WILDCARD_ROUTES.PRIVATE} />,
    title: 'Rendering wildcard',
  },
];