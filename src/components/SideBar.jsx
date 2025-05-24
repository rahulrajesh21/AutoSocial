import React from 'react';
import { Home, Users, Zap, Puzzle, Settings, HelpCircle } from 'lucide-react';

export const SideBar = () => (
  <div className="w-64 flex flex-col bg-secondary text-white p-4 h-screen">
    <ul className="space-y-2">
      <li className="hover:bg-gray-700 p-2 rounded-lg transition-colors">
        <a href="#" className="block">
          <div className="flex items-center space-x-3">
            <Home size={20} />
            <p>Home</p>
          </div>
        </a>
      </li>
      <li className="hover:bg-gray-700 p-2 rounded-lg transition-colors">
        <a href="#" className="block">
          <div className="flex items-center space-x-3">
            <Users size={20} />
            <p>Contacts</p>
          </div>
        </a>
      </li>
      <li className="hover:bg-gray-700 p-2 rounded-lg transition-colors">
        <a href="#" className="block">
          <div className="flex items-center space-x-3">
            <Zap size={20} />
            <p>Automations</p>
          </div>
        </a>
      </li>
      <li className="hover:bg-gray-700 p-2 rounded-lg transition-colors">
        <a href="#" className="block">
          <div className="flex items-center space-x-3">
            <Puzzle size={20} />
            <p>Integrations</p>
          </div>
        </a>
      </li>
      <li className="hover:bg-gray-700 p-2 rounded-lg transition-colors">
        <a href="#" className="block">
          <div className="flex items-center space-x-3">
            <Settings size={20} />
            <p>Settings</p>
          </div>
        </a>
      </li>
      <li className="hover:bg-gray-700 p-2 rounded-lg transition-colors">
        <a href="#" className="block">
          <div className="flex items-center space-x-3">
            <HelpCircle size={20} />
            <p>Help</p>
          </div>
        </a>
      </li>
    </ul>

    <div className="mt-auto space-y-4">
      <div className="bg-primary p-6 rounded-lg text-center shadow-lg">
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
          className="mt-4 px-6 py-2 rounded-full text-white font-medium transition-all duration-500 hover:shadow-lg"
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
          className="rounded-full w-12 h-12 flex-shrink-0"
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

export default SideBar;
