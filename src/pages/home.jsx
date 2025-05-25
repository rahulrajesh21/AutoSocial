import React from 'react';
import { Plus } from 'lucide-react';
import { AutomationCards } from '../components/cards/AutomationCards';

const Home = () => {
  return (
    <div className="mt-6 h-full text-white">
      <div className="flex items-center justify-between border-b border-borderColor w-full p-4">
        <h1 className="text-4xl font-semibold">Workflows</h1>
        <button className="p-2 bg-white rounded-lg transition-colors">
          <Plus color="black" size={24} />
        </button>
      </div>
      <div className="flex flex-col mt-6 p-4 space-y-2">
        <AutomationCards />
        <AutomationCards />
        <AutomationCards />
      </div>
    </div>
  );
};

export default Home;
