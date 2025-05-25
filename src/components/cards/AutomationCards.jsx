import React, { useState } from 'react';

export const AutomationCards = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const CustomToggle = ({ checked, onChange }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-7 w-12 items-center rounded-full 
        transition-all duration-300 ease-in-out transform hover:scale-105
        ${
          checked
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/30'
            : 'bg-gray-700 hover:bg-gray-600'
        }
      `}
      style={{
        boxShadow: checked ? '0 0 20px rgba(147, 51, 234, 0.4)' : 'none',
      }}
    >
      <span
        className={`
          inline-block h-5 w-5 transform rounded-full bg-white 
          transition-all duration-300 ease-out shadow-md
          ${checked ? 'translate-x-6 scale-110' : 'translate-x-1'}
        `}
        style={{
          boxShadow: checked
            ? '0 2px 8px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(147, 51, 234, 0.2)'
            : '0 2px 4px rgba(0, 0, 0, 0.2)',
        }}
      />
    </button>
  );

  return (
    <div className="w-full">
      <div
        className="
          w-full flex flex-row items-center justify-between min-h-32 
          
          border border-borderColor rounded-2xl p-6 
          transition-all duration-300 ease-out
          hover:border-gray-600 hover:shadow-xl hover:shadow-black/20
          hover:from-gray-800 hover:to-gray-700
          transform hover:-translate-y-1
        "
      >
        <div className="flex-1">
          <div className="flex flex-row items-center gap-3 mb-3">
            <img
              src="icons/facebook_icon.png"
              alt="Facebook Icon"
              className="w-6 h-6"
            />
            <img
              src="icons/instagram_icon.png"
              alt="Twitter Icon"
              className="w-6 h-6"
            />
          </div>

          <h2 className="text-xl font-semibold text-white mb-1 transition-colors duration-300">
            Workflow 1
          </h2>
          <p className="text-gray-400 text-sm transition-colors duration-300">
            Creating a test Workflow
          </p>
        </div>
        <div className="flex items-center ml-6">
          <div className="flex flex-col items-center gap-2">
            <CustomToggle checked={isEnabled} onChange={setIsEnabled} />
            <span
              className={`
              text-xs font-medium transition-all duration-300
              ${isEnabled ? 'text-purple-400' : 'text-gray-500'}
            `}
            >
              {isEnabled ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
