// Layout.js
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { SideBar } from './SideBar';
import { Menu } from 'lucide-react';

const Layout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  
  // Handle responsive sidebar based on screen size
  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth >= 768); // Show sidebar by default on tablets and larger
    };
    
    // Initial check
    handleResize();
    
    // Listen for window resize events
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="h-screen flex flex-col md:flex-row bg-primary">
      {/* Mobile menu toggle button - only visible on small screens */}
      <div className="md:hidden flex items-center p-4 border-b border-borderColor">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 rounded-md hover:bg-foreground transition-colors"
          aria-label={showSidebar ? "Close menu" : "Open menu"}
        >
          <Menu size={24} className="text-white" />
        </button>
        <div className="ml-4 font-medium text-white">AutoSocial</div>
      </div>
      
      {/* Sidebar with improved slide animation */}
      <div 
        className={`fixed md:relative top-0 left-0 h-full transform sidebar-transition ${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-50`}
        style={{ width: 'max-content', height: '100vh' }}
      >
        <SideBar onCloseMobile={() => setShowSidebar(false)} />
      </div>
      
      {/* Overlay to close sidebar when clicked (mobile only) */}
      {showSidebar && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowSidebar(false)}
        />
      )}
      
      {/* Main content area */}
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
