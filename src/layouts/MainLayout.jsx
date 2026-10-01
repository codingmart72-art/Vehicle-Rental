import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import RoleSwitcherBanner from '../components/common/RoleSwitcherBanner';

export const MainLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <RoleSwitcherBanner />
      <Navbar />
      <main style={{ flex: 1, padding: '24px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
