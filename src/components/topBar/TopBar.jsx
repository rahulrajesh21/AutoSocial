import React from 'react';
import { SearchBar } from '../SearchBar';
import { BookMarked } from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';

export const TopBar = () => {
  return (
    <div className="flex items-center justify-between px-4  bg-primary text-white">
      <h1 className="text-2xl font-bold">AutoSocial</h1>
      <SearchBar />
      <div className="flex items-center space-x-4 text-white">
        <BookMarked />
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
