import React, { useState, useEffect } from 'react';
import { Handle } from '@xyflow/react';
import { Type } from 'lucide-react';

const TextNode = ({ id, data, isConnectable }) => {
  const [text, setText] = useState(data.text || '');

  useEffect(() => {
    if (data.onDataChange && text !== data.text) {
      data.onDataChange({
        id,
        text
      });
    }
  }, [text, data, id]);

  return (
    <div className="rounded-lg border-2 border-blue-500 bg-gray-800 p-4 shadow-lg w-[300px]">
      {/* Input handle */}
      <Handle
        type="target"
        position="left"
        id="input"
        style={{ background: '#3b82f6', width: '10px', height: '10px' }}
        isConnectable={isConnectable}
      />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Type size={16} className="text-blue-400" />
          <span className="font-medium text-white">Static Text</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Enter Text
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
          placeholder="Enter static text here..."
          rows={4}
        />
      </div>

      <div className="text-xs text-gray-400 mt-2">
        This node provides static text that can be used in your workflow.
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position="right"
        id="output"
        style={{ background: '#3b82f6', width: '10px', height: '10px' }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default TextNode; 