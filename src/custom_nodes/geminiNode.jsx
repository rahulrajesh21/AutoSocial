import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { MessageSquareText } from 'lucide-react';

const GeminiNode = ({ data, selected }) => {
  const [prompt, setPrompt] = useState(data.prompt || '');
  
  // Update local state when data changes from outside
  useEffect(() => {
    setPrompt(data.prompt || '');
  }, [data.prompt]);
  
  // Handle prompt changes and notify parent component
  const handlePromptChange = (e) => {
    const newPrompt = e.target.value;
    setPrompt(newPrompt);
    
    // Update the node data via the callback
    if (data.onDataChange) {
      data.onDataChange({
        ...data,
        prompt: newPrompt
      });
    }
  };

  return (
    <div className={`bg-primary text-white rounded-lg shadow-lg border-2 ${selected ? 'border-indigo-500' : 'border-borderColor'} p-4 w-[300px] cursor-pointer`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex space-x-1 items-center justify-center">
          <MessageSquareText size={16} className="text-indigo-400 mt-1" />
          <div className="text-sm font-semibold text-indigo-400">Prompt</div>
        </div>
        <div className="text-xs border border-borderColor bg-borderColor text-center text-white px-2 py-0.5 rounded-full">
          Gemini AI
        </div>
      </div>
      <div className="mt-2 bg-gray-800 rounded-lg p-3 w-full">
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <textarea
              value={prompt}
              onChange={handlePromptChange}
              placeholder="Enter your prompt here..."
              className="w-full bg-gray-800 text-gray-200 border-none outline-none resize-y min-h-[80px] text-sm placeholder-gray-500"
            />
          </div>
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-white" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-white" />
    </div>
  );
};

export default GeminiNode;