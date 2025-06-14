import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { LifeBuoy, Tag } from 'lucide-react';

const HelpDeskNode = ({ data }) => {
  const ticketCategories = [
    { value: 'account', label: 'Account Issues' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'billing', label: 'Billing Questions' },
    { value: 'feature', label: 'Feature Requests' },
    { value: 'other', label: 'Other' }
  ];

  // FIXED: Improved data change handler
  const handleDataChange = (updates) => {
    console.log('HelpDeskNode handleDataChange called with:', updates);
    console.log('Current data:', data);
    console.log('onDataChange exists:', !!data.onDataChange);
    
    if (data.onDataChange) {
      const updatedData = {
        id: data.id,
        ...data,
        ...updates
      };
      console.log('Calling onDataChange with:', updatedData);
      data.onDataChange(updatedData);
    } else {
      console.warn('onDataChange callback not found in data');
    }
  };

  return (
    <div className="bg-emerald-900 text-white rounded-lg shadow-lg border-2 border-emerald-700 p-4 w-[300px] cursor-pointer">
      <div className="flex justify-between items-start mb-2">
        <div className="flex space-x-1 items-center justify-center">
          <LifeBuoy size={16} className="text-emerald-400 mt-1" />
          <div className="text-sm font-semibold text-white">Help Desk</div>
        </div>
        <div className="text-xs border border-emerald-700 bg-emerald-800 text-center text-white px-2 py-0.5 rounded-full">
          Support
        </div>
      </div>
      
      <div className="mt-2 bg-emerald-950 rounded-lg p-3 w-full">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Tag size={14} className="text-emerald-400" />
            <select
              className="bg-emerald-800 text-white text-xs rounded px-2 py-1 w-full border border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={data.category || 'technical'}
              onChange={(e) => {
                console.log('Category select onChange triggered, new value:', e.target.value);
                handleDataChange({ category: e.target.value });
              }}
            >
              {ticketCategories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="text-xs text-emerald-300 mt-1">Response Template:</div>
          <textarea
            className="w-full bg-emerald-800 border border-emerald-700 rounded text-xs p-2 text-white placeholder-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            placeholder="Enter your support response template here..."
            rows={3}
            value={data.responseTemplate || ''}
            onChange={(e) => {
              console.log('Response template onChange triggered');
              handleDataChange({ responseTemplate: e.target.value });
            }}
          />
          
          <div className="flex items-center mt-1">
            <input
              type="checkbox"
              id={`createTicket-${data.id}`}
              className="mr-2 h-3 w-3 rounded border-emerald-700 text-emerald-500 focus:ring-emerald-500"
              checked={data.createTicket !== false}
              onChange={(e) => {
                console.log('Create ticket checkbox onChange triggered');
                handleDataChange({ createTicket: e.target.checked });
              }}
            />
            <label htmlFor={`createTicket-${data.id}`} className="text-xs text-emerald-300">
              Create support ticket
            </label>
          </div>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-emerald-400">
        {data.createTicket !== false 
          ? 'Will create a ticket in your help desk system' 
          : 'Only responding, no ticket creation'
        }
      </div>
      
      {/* Debug info - remove this in production */}
      <div className="mt-1 text-xs text-emerald-300 opacity-50">
        Current: {data.category || 'technical'} | ID: {data.id}
      </div>
      
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-white" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-white" />
    </div>
  );
};

export default HelpDeskNode;