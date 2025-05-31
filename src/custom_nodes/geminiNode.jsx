import React from 'react';
import { Handle, Position } from '@xyflow/react';

const GeminiNode = ({ data }) => {
  return (
    <div className="bg-gray-900 text-white rounded-lg shadow-lg border border-gray-700 p-4 min-w-[200px] cursor-pointer">
      <div className="font-semibold text-sm mb-2 text-cyan-400">Gemini AI</div>

      <div className="text-xs text-gray-300 mb-3">
        {data.prompt || 'No prompt provided'}
      </div>

      <button
        onClick={data.onRun}
        className="px-3 py-1 text-xs bg-cyan-600 hover:bg-cyan-700 rounded"
      >
        Run
      </button>

      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-white" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-white" />
    </div>
  );
};

export default GeminiNode;