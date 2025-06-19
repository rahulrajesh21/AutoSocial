import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Zap, 
  Puzzle, 
  Settings,
  HelpCircle,
  ChevronLeft, 
  ChevronRight,
  PlusCircle,
  LogOut,
  X
} from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';

export const SideBar = ({ isAutomationsDesigner = false, onCloseMobile }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  
  // Check if we're in mobile view
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Check for saved sidebar state in localStorage or force collapsed state for AutomationsDesigner
  useEffect(() => {
    if (isAutomationsDesigner) {
      setCollapsed(true);
    } else if (!isMobile) {
      const savedState = localStorage.getItem('sidebarCollapsed');
      if (savedState !== null) {
        setCollapsed(savedState === 'true');
      }
    } else {
      // On mobile, don't collapse by default
      setCollapsed(false);
    }
  }, [isAutomationsDesigner, isMobile]);
  
  // Save sidebar state when it changes (but only if not in AutomationsDesigner)
  useEffect(() => {
    if (!isAutomationsDesigner && !isMobile) {
      localStorage.setItem('sidebarCollapsed', collapsed);
    }
  }, [collapsed, isAutomationsDesigner, isMobile]);

  // Main navigation items
  const mainNavItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/contacts', label: 'Contacts', icon: Users },
    { path: '/automations', label: 'Automations', icon: Zap },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  // Help items
  const helpItems = [
    { path: '/help', label: 'Help Center', icon: HelpCircle },
  ];

  const handleSignOut = () => {
    signOut();
  };

  const handleOpenUserProfile = () => {
    openUserProfile();
  };

  const handleToggleCollapse = () => {
    // Only allow toggling if not in AutomationsDesigner
    if (!isAutomationsDesigner) {
      setCollapsed(!collapsed);
    }
  };
  
  // Handle navigation click on mobile - close the sidebar
  const handleNavClick = () => {
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <div 
      className={`${isMobile ? 'w-64' : collapsed ? 'w-16' : 'w-64'} flex flex-col bg-[#0f0f0f] text-white py-3 h-full overflow-hidden transition-all duration-300 ease-in-out relative border-r border-[#252525] animate-fadeIn`}
      style={{ height: '100%' }}
    >
      {/* Mobile close button - Only visible on mobile */}
      {isMobile && onCloseMobile && (
        <button 
          className="absolute right-4 top-4 text-white hover:text-gray-300"
          onClick={onCloseMobile}
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      )}
    
      {/* Toggle button - Only show if not in mobile and not in AutomationsDesigner */}
      {!isMobile && (
        <button 
          className={`absolute -right-2.5 top-8 bg-[#252525] ${isAutomationsDesigner ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#333333] cursor-pointer'} rounded-full p-1 text-white shadow-lg z-10 transition-all duration-200 border border-[#333333] focus:outline-none focus:ring-1 focus:ring-[#444444]`}
          onClick={handleToggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          disabled={isAutomationsDesigner}
          title={isAutomationsDesigner ? "Sidebar is locked in collapsed mode on this page" : undefined}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      )}

      {/* Company/App Logo Section */}
      <div className={`flex items-center ${isMobile || !collapsed ? 'px-4' : 'justify-center'} mb-6`}>
        {!isMobile && collapsed ? (
          <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
            <span className="text-black font-bold text-sm">A</span>
          </div>
        ) : (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center mr-3">
              <span className="text-black font-bold text-sm">A</span>
            </div>
            <span className="font-medium text-white">AutoSocial</span>
          </div>
        )}
      </div>

      {/* Main Navigation Section */}
      <div className="px-2">
        <ul>
          {mainNavItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li 
                key={item.path} 
                className="mb-1" 
                style={{ 
                  animation: `fadeIn 0.3s ease-out ${index * 0.05}s forwards`,
                  opacity: 0
                }}
                onClick={handleNavClick}
              >
                <Link
                  to={item.path}
                  className={`flex items-center ${!isMobile && collapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-md transition-all duration-200 ${
                    isActive
                      ? 'bg-[#252525] text-white shadow-sm'
                      : 'text-white hover:bg-[#1e1e1e] hover:text-white'
                  }`}
                  title={!isMobile && collapsed ? item.label : ""}
                >
                  <Icon size={!isMobile && collapsed ? 18 : 16} className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-300'}`} />
                  {(isMobile || !collapsed) && (
                    <span 
                      className={`ml-3 text-sm transition-all duration-300 ${isActive ? 'text-white font-medium' : 'text-gray-200'}`}
                      style={{ 
                        opacity: !isMobile && collapsed ? 0 : 1, 
                        transform: !isMobile && collapsed ? 'translateX(-10px)' : 'translateX(0)'
                      }}
                    >
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Help Section Heading */}
      {(isMobile || !collapsed) && (
        <div className="px-6 mt-6 mb-2">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Support</h3>
        </div>
      )}
      {!isMobile && collapsed && <div className="border-t border-[#252525] my-4 mx-2"></div>}

      {/* Help Navigation Section */}
      <div className="px-2">
        <ul>
          {helpItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li 
                key={item.path} 
                className="mb-1" 
                style={{ animation: 'fadeIn 0.3s ease-out 0.3s forwards', opacity: 0 }}
                onClick={handleNavClick}
              >
                <Link
                  to={item.path}
                  className={`flex items-center ${!isMobile && collapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-md transition-all duration-200 ${
                    isActive
                      ? 'bg-[#252525] text-white shadow-sm'
                      : 'text-white hover:bg-[#1e1e1e] hover:text-white'
                  }`}
                  title={!isMobile && collapsed ? item.label : ""}
                >
                  <Icon size={!isMobile && collapsed ? 18 : 16} className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-300'}`} />
                  {(isMobile || !collapsed) && (
                    <span 
                      className={`ml-3 text-sm transition-all duration-300 ${isActive ? 'text-white font-medium' : 'text-gray-200'}`}
                      style={{ 
                        opacity: !isMobile && collapsed ? 0 : 1, 
                        transform: !isMobile && collapsed ? 'translateX(-10px)' : 'translateX(0)'
                      }}
                    >
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      
      {/* User profile and signout from Clerk */}
      <div className="mt-auto border-t border-[#252525] pt-4 px-2" style={{ animation: 'fadeIn 0.3s ease-out 0.4s forwards', opacity: 0 }}>
        {user && (
          <>
            {!isMobile && collapsed ? (
              <div className="flex justify-center mb-4">
                <div 
                  className="group relative cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={handleOpenUserProfile}
                >
                  {user.hasImage ? (
                    <img 
                      src={user.imageUrl} 
                      alt={user.fullName || "User"} 
                      className="w-8 h-8 rounded-full" 
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#252525] flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user.firstName?.charAt(0) || "U"}
                      </span>
                    </div>
                  )}
                  <div className="invisible group-hover:visible absolute left-full ml-2 bg-[#333] text-white text-xs p-2 rounded shadow-lg whitespace-nowrap z-10">
                    {user.fullName || user.username}
                    <br />
                    {user.primaryEmailAddress?.emailAddress}
                    <br />
                    <span className="text-blue-300">Click to manage account</span>
                  </div>
                </div>
              </div>
            ) : (
              <div 
                className="flex items-center px-3 py-2 mb-4 cursor-pointer hover:bg-[#1e1e1e] rounded-md transition-colors duration-200"
                onClick={handleOpenUserProfile}
              >
                {user.hasImage ? (
                  <img 
                    src={user.imageUrl} 
                    alt={user.fullName || "User"} 
                    className="w-8 h-8 rounded-full mr-3" 
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#252525] flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-white">
                      {user.firstName?.charAt(0) || "U"}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-white truncate">{user.fullName || user.username}</p>
                  <p className="text-gray-400 text-xs truncate">{user.primaryEmailAddress?.emailAddress}</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className={`w-full flex items-center ${!isMobile && collapsed ? 'justify-center' : 'px-3'} py-2 rounded-md text-white hover:bg-[#252525] hover:text-white transition-colors duration-200`}
          title={!isMobile && collapsed ? "Sign Out" : ""}
        >
          <LogOut size={!isMobile && collapsed ? 18 : 16} className="flex-shrink-0 text-gray-300" />
          {(isMobile || !collapsed) && <span className="ml-3 text-sm">Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

export default SideBar;
