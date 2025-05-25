import React from 'react';
import { Search } from 'lucide-react';

export const SearchBar = () => {
  return (
    <div className="w-full max-w-md mx-auto my-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 pl-10 rounded-lg bg-secondary text-white placeholder-gray-300"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      </div>
    </div>
  );
};
