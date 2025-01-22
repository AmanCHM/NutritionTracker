import { useLocation } from 'react-router-dom';
import { Path, pathToRegexp } from 'path-to-regexp';
import AUTH_ROUTES from './AuthRoutes';
import { PRIVATE_ROUTES } from './PrivateRoutes';
import { PUBLIC_ROUTES } from './PublicRoutes';
import { CustomRouter } from './RootRoutes';
import React from 'react';
import { Helmet } from 'react-helmet-async';

// eslint-disable-next-line react/prop-types
function DocumentTitle({ isAuthenticated = false }) {
  const location = useLocation();
  const ROUTES: CustomRouter[] = PUBLIC_ROUTES.concat(
    isAuthenticated ? PRIVATE_ROUTES : AUTH_ROUTES
  );
  
//   const matchedRoute: CustomRouter | undefined = ROUTES.find(
//       (route: CustomRouter) =>
       
//         route.path !== '*' &&
//       pathToRegexp(route.path as Path).test(location.pathname)
//   );

const matchedRoute: CustomRouter | undefined = ROUTES.find(
  (route: CustomRouter) => {
    if (route.path === '*' || !route.path) return false; 
    try {
      const { regexp } = pathToRegexp(route.path as Path); 
      return regexp.test(location.pathname); 
    } catch (error) {
      console.error('Error creating regex from path:', route.path);
      return false;
    }
  }
);

  const title = matchedRoute ? matchedRoute.title : '';
  return (
    <Helmet>
      <title>{title}</title>
      <meta/>
    </Helmet>
  );
}

export default DocumentTitle;