import { Navigate } from 'react-router-dom';

import { CustomRouter } from './RootRoutes';
import { ROUTES_CONFIG, WILDCARD_ROUTES } from '../Shared/Constants';

// eslint-disable-next-line import/prefer-default-export
export const PUBLIC_ROUTES: Array<CustomRouter> = [
  {
    path: ROUTES_CONFIG.HOMEPAGE.path,
    element: '<Home />',
    title: ROUTES_CONFIG.HOMEPAGE.title,
  },
  {
    path: `${ROUTES_CONFIG.LOGIN.path}`,
    title: ROUTES_CONFIG.LOGIN.title,
    element: '<Login />',
  },
  {
    path: '*',
    element: <Navigate to={WILDCARD_ROUTES.PUBLIC} />,
    title: 'Rendering wildcard',
  },
];