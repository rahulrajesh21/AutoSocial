import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { MessageSquareText } from 'lucide-react';

const GeminiNode = ({ data }) => {
  return (
    <div className="bg-primary text-white rounded-lg shadow-lg border-2 border-borderColor p-4 w-[300px] cursor-pointer">
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
            <div className="mt-1 text-sm text-gray-200 whitespace-pre-wrap break-words overflow-wrap-anywhere word-break-break-all">
              {data.prompt || (
                <span className="text-gray-500 italic">No prompt provided.</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-white" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-white" />
    </div>
  );
};

export default GeminiNode;