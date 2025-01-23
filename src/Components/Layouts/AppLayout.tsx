import React from 'react';
import { AppLayoutProps } from './AppLayout.d';
import PrivateLayout from './Private/PrivateLayout';
import PublicLayout from './Public/PublicLayout';

function AppLayout({ isAuthenticated, children }: AppLayoutProps) {
  return isAuthenticated ? (
    <PrivateLayout>{children}</PrivateLayout>
  ) : (
    <PublicLayout>{children}</PublicLayout>
  );
}

export default AppLayout;