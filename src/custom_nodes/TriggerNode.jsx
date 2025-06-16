import React, { useState, useEffect } from 'react';
import { Handle } from '@xyflow/react';

const TriggerNode = ({ id, data, isConnectable }) => {
  const [triggerWord, setTriggerWord] = useState(data.triggerWord || '');
  const [caseSensitive, setCaseSensitive] = useState(data.caseSensitive || false);

  useEffect(() => {
    if (data.onDataChange && (
      triggerWord !== data.triggerWord ||
      caseSensitive !== data.caseSensitive
    )) {
      data.onDataChange({
        id,
        triggerWord,
        caseSensitive
      });
    }
  }, [triggerWord, caseSensitive, data, id]);

  return (
    <div className="rounded-lg border-2 border-orange-500 bg-gray-800 p-4 shadow-lg w-[300px]">
      {/* Input handle */}
      <Handle
        type="target"
        position="left"
        id="input"
        style={{ background: '#f97316', width: '10px', height: '10px' }}
        isConnectable={isConnectable}
      />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="bg-orange-500 rounded-full w-3 h-3"></div>
          <span className="font-medium text-white">Trigger Word</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Trigger Word
        </label>
        <input
          type="text"
          value={triggerWord}
          onChange={(e) => setTriggerWord(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-orange-500"
          placeholder="Enter trigger word or phrase"
        />
      </div>

      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          id={`case-sensitive-${id}`}
          checked={caseSensitive}
          onChange={(e) => setCaseSensitive(e.target.checked)}
          className="mr-2 h-4 w-4 accent-orange-500"
        />
        <label htmlFor={`case-sensitive-${id}`} className="text-sm text-gray-300">
          Case Sensitive
        </label>
      </div>

      <div className="text-xs text-gray-400 mt-2">
        This node will check for the trigger word in incoming messages or comments.
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position="right"
        id="output"
        style={{ background: '#f97316', width: '10px', height: '10px' }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default TriggerNode; 