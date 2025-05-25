// Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SideBar } from './SideBar';
import { TopBar } from './topBar/TopBar';

const Layout = () => {
  return (
    <div className="h-screen flex flex-col">
      <TopBar />
      <div className="flex flex-1 h-full">
        <SideBar />
        <main className="flex-1 overflow-auto bg-primary">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
