import { ROUTES_CONFIG } from '../Shared/Constants';
import { CustomRouter } from './RootRoutes';

const AUTH_ROUTES: Array<CustomRouter> = [
  // {
  //   path: '/forgot-password',
  //   component: ForgotPassword,
  //   title: 'Forgot Password',
  // },

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
];

export default AUTH_ROUTES;