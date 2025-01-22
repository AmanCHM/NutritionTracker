import { RouteObject } from 'react-router-dom';
import React, { Suspense } from 'react';

import { PUBLIC_ROUTES } from './PublicRoutes';
import { PRIVATE_ROUTES } from './PrivateRoutes';
import { GUEST_ROUTES } from './GuestRoutes';


export const publicRoutes: Array<RouteObject> = [
  ...([...PUBLIC_ROUTES, ...GUEST_ROUTES]?.map((routes) => {
    return {
      ...routes,
      element: <Suspense fallback="Loading...">{routes.element}</Suspense>,
    };
  }) || []),
];

export const authenticatedRoutes: Array<RouteObject> = [
  ...([...PRIVATE_ROUTES, ...GUEST_ROUTES]?.map((routes) => {
    return {
      ...routes,
      element: <Suspense fallback="Loading...">{routes.element}</Suspense>,
    };
  }) || []),
];