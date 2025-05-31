// CustomNode.jsx
import React from 'react';
import { Handle, Position } from '@xyflow/react';

const InstgramNode = ({ data }) => {
  return (
    <div className="bg-gray-900 text-white rounded-lg shadow-lg border border-gray-700 p-4 min-w-[200px] cursor-pointer">
      <h4 className="font-bold text-sm mb-2">{data.label}</h4>

      <button
        onClick={data.onRun}
        className="px-3 py-1 text-xs bg-cyan-600 hover:bg-cyan-700 rounded"
      >
        Run
      </button>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default InstgramNode;