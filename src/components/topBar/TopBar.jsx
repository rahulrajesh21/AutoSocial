import React from 'react';
import { SearchBar } from '../SearchBar';
import { BookMarked } from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';

const AutoSocialLogo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <svg 
          width="38" 
          height="38" 
          viewBox="0 0 38 38" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main outer ring with gradient */}
          <circle cx="19" cy="19" r="17.5" stroke="url(#outer-gradient)" strokeWidth="2.5" />
          
          {/* Decorative orbit rings */}
          <ellipse cx="19" cy="19" rx="13" ry="8" stroke="white" strokeOpacity="0.4" strokeWidth="1" transform="rotate(45 19 19)" />
          <ellipse cx="19" cy="19" rx="13" ry="8" stroke="white" strokeOpacity="0.4" strokeWidth="1" transform="rotate(-45 19 19)" />
          
          {/* Central hub */}
          <circle cx="19" cy="19" r="4.5" fill="url(#center-gradient)" />
          
          {/* Network nodes - representing social platforms */}
          <circle cx="19" cy="7" r="3" fill="#60A5FA" /> {/* Twitter/X */}
          <circle cx="31" cy="19" r="3" fill="#F87171" /> {/* Instagram */}
          <circle cx="19" cy="31" r="3" fill="#34D399" /> {/* WhatsApp */}
          <circle cx="7" cy="19" r="3" fill="#FBBF24" /> {/* Facebook */}
          
          {/* Connecting lines */}
          <path d="M19 19L19 7M19 19L31 19M19 19L19 31M19 19L7 19" stroke="white" strokeWidth="1.5" />
          
          {/* Automation symbol in the center */}
          <path 
            d="M19 17.5V20.5M17.5 19H20.5" 
            stroke="white" 
            strokeWidth="1.5" 
            strokeLinecap="round"
          />
          
          {/* Gradients */}
          <defs>
            <linearGradient id="outer-gradient" x1="1.5" y1="1.5" x2="36.5" y2="36.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3B82F6" />
              <stop offset="0.5" stopColor="#8B5CF6" />
              <stop offset="1" stopColor="#EC4899" />
            </linearGradient>
            <radialGradient id="center-gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
              gradientTransform="translate(19 19) rotate(90) scale(4.5)">
              <stop stopColor="#93C5FD" />
              <stop offset="1" stopColor="#3B82F6" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      
      <div>
        <div className="flex items-center">
          <span className="text-2xl font-bold text-white">Auto</span>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Social</span>
        </div>
        
      </div>
    </div>
  );
};

export const TopBar = () => {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-primary text-white shadow-md">
      <AutoSocialLogo />
      <SearchBar />
      <div className="flex items-center space-x-4">
        <BookMarked className="hover:text-blue-400 transition-colors duration-200" />
        <UserButton 
          showName 
          appearance={{
            elements: {
              userButtonBox: "text-white",
              userButtonText: "text-white",
              userButtonOuterIdentifier: "text-white",
              userButtonTrigger: "text-white"
            }
          }}
        />
      </div>
    </div>
  );
};
