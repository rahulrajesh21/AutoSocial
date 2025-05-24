import React from 'react';

export const SideBar = () => (
  <div className="w-64 bg-secondary text-white p-4 rou">
    <h2 className="text-xl font-bold mb-4">Sidebar</h2>
    <ul className="space-y-2">
      <li className=" hover:bg-foreground p-2 rounded-lg">
        <a href="#" className="">
          Home
        </a>
      </li>
      <li className=" hover:bg-foreground p-2 rounded-lg">
        <a href="#" className="">
          Contacts
        </a>
      </li>
      <li className=" hover:bg-foreground p-2 rounded-lg">
        <a href="#" className="">
          Automations
        </a>
      </li>
      <li className=" hover:bg-foreground p-2 rounded-lg">
        <a href="#" className="">
          Integrations
        </a>
      </li>
      <li className=" hover:bg-foreground p-2 rounded-lg">
        <a href="#" className="">
          Settings
        </a>
      </li>
      <li className=" hover:bg-foreground p-2 rounded-lg">
        <a href="#" className="">
          Help
        </a>
      </li>
    </ul>
  </div>
);
