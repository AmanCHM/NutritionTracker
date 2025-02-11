import { useSelector } from 'react-redux';
import { useRoutes } from 'react-router-dom';
import React from 'react';


import type { RootState } from '../Store';
import { authenticatedRoutes, publicRoutes } from './Config';
import DocumentTitle from './DocumentTitle';
import AppLayout from '../Components/Layouts/AppLayout';

function RootRouter() {
  const guest = useRoutes(publicRoutes);
  const authenticated = useRoutes(authenticatedRoutes);
  const token = useSelector((state: RootState) => state.Auth.logged);
  const isAuthenticated = !!token;

  return (
    <>
      <DocumentTitle isAuthenticated={isAuthenticated} />
      <AppLayout isAuthenticated={isAuthenticated}>
        {token ? authenticated : guest}
      </AppLayout>
    </>
  );
}

export default RootRouter;