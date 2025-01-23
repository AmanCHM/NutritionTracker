import { AppLayoutProps } from '../AppLayout.d';
import Footer from './Footer';
import Navbar from './Navbar';
import React from 'react';

function PublicLayout({ children }: AppLayoutProps): JSX.Element {
  return (
    <>

      <main className="sidebar-right">
        <Navbar />
        {children}
      </main>
      <Footer />
    </>
  );
}

export default PublicLayout;
