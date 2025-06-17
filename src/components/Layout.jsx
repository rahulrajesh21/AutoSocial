// Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SideBar } from './SideBar';

const Layout = () => {
  return (
    <div className="h-screen flex bg-primary">
      <SideBar />
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
