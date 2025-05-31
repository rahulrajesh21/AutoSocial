// Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SideBar } from './SideBar';
import { TopBar } from './topBar/TopBar';

const Layout = () => {
  return (
    <div className="h-screen flex flex-col bg-primary">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <SideBar />
        <main className="flex-1 overflow-auto bg-primary border-[1px] border-borderColor rounded-3xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
