import { AppLayoutProps } from '../AppLayout.d';
import React from 'react';
import Navbar from '../Public/Navbar';
import Footer from '../Public/Footer';
function PrivateLayout({ children }: AppLayoutProps): JSX.Element {
  return (
   <>
   <Navbar />   
   {children}
   <Footer/>
   </>
  );
}

export default PrivateLayout;