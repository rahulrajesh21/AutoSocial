import React from 'react';
import { SearchBar } from '../SearchBar';

export const TopBar = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-primary text-white">
      <h1 className="text-2xl font-bold">AutoSocial</h1>

      <SearchBar />
    </div>
  );
};
