import React from 'react';
import { SearchBar } from '../SearchBar';
import { BookMarked } from 'lucide-react';

export const TopBar = () => {
  return (
    <div className="flex items-center justify-between px-4  bg-primary text-white">
      <h1 className="text-2xl font-bold">AutoSocial</h1>
      <SearchBar />
      <div className="flex items-center space-x-4">
        <BookMarked />
        <img
          src="https://avatar.iran.liara.run/public"
          alt="Profile"
          className="rounded-full w-10 h-10 flex-shrink-0"
        />
      </div>
    </div>
  );
};
