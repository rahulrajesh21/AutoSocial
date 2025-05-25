import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Zap, Puzzle, Settings, HelpCircle } from 'lucide-react';

export const SideBar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/contacts', label: 'Contacts', icon: Users },
    { path: '/automations', label: 'Automations', icon: Zap },
    { path: '/integrations', label: 'Integrations', icon: Puzzle },
    { path: '/settings', label: 'Settings', icon: Settings },
    { path: '/help', label: 'Help', icon: HelpCircle },
  ];

  return (
    <div className="w-64 flex flex-col text-white p-4 h-full">
      <ul className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 p-2 rounded-lg ${
                  location.pathname === item.path
                    ? 'bg-foreground text-white'
                    : 'hover:bg-foreground'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto space-y-4 pt-4">
        <div className="bg-secondary p-4 rounded-lg text-center shadow-lg">
          <p className="text-white text-lg font-semibold">
            Upgrade to{' '}
            <span className="bg-gradient-to-r from-pink-500 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Smart AI
            </span>
          </p>
          <p className="text-gray-300 mt-2 text-sm">
            Unlock AI features and more.
          </p>
          <button
            className="mt-3 px-4 py-1.5 rounded-full text-white font-medium transition-all duration-500 hover:shadow-lg"
            style={{
              backgroundImage:
                'linear-gradient(to right, #AA076B 0%, #61045F 51%, #AA076B 100%)',
              backgroundSize: '200% auto',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundPosition = 'right center';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundPosition = 'left center';
            }}
          >
            Upgrade
          </button>
        </div>

        <div className="flex items-center space-x-3 p-2">
          <img
            src="https://avatar.iran.liara.run/public"
            alt="Profile"
            className="rounded-full w-10 h-10 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm">John Doe</p>
            <p className="text-gray-300 text-xs truncate">
              tester123213213@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
