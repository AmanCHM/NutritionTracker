
import { ROUTES_CONFIG, WILDCARD_ROUTES } from '../Shared/Constants';
import { CustomRouter } from './RootRoutes';
import { Navigate } from 'react-router-dom';
import React from 'react';
import Dashboard from '../Views/Pages/Dashboard';
import About from '../Views/Pages/About';
import CalorieCalculator from '../Views/Pages/CalorieCalculator';

import Home from '../Views/Pages/Home';
import Reports from '../Views/Pages/Reports';
import Contact from '../Views/Pages/Contact';




// eslint-disable-next-line import/prefer-default-export
export const PRIVATE_ROUTES: Array<CustomRouter> = [
  {
    path: `${ROUTES_CONFIG.HOMEPAGE.path}/:page?`,
    element: <Dashboard />,
    title: ROUTES_CONFIG.HOMEPAGE.title,
  },
  {
    path: ROUTES_CONFIG.ABOUT.path,
    element: <About />,
    title: ROUTES_CONFIG.ABOUT.title,
  },
  {
    path: ROUTES_CONFIG.CALORIE_CALCULATOR.path,
    element: <CalorieCalculator />,
    title: ROUTES_CONFIG.ABOUT.title,
  },
  {
    path: ROUTES_CONFIG.REPORTS.path,
    element: <Reports />,
    title: ROUTES_CONFIG.ABOUT.title,
  },
  {
    path: ROUTES_CONFIG.HOMEPAGE.path,
    element: <Home />,
    title: ROUTES_CONFIG.ABOUT.title,
  },
  {
    path: ROUTES_CONFIG.CONTACT.path,
    element: <Contact />,
    title: ROUTES_CONFIG.CONTACT.title,
  },
  {
    path: '*',
    element: <Navigate to={WILDCARD_ROUTES.PRIVATE} />,
    title: 'Rendering wildcard',
  },
];