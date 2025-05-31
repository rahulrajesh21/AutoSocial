// CustomNode.jsx
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Instagram } from 'lucide-react';

const InstgramNode = ({ data }) => {
    console.log("Instagram Node Data:", data);
  return (
    <div className="bg-primary text-white rounded-lg shadow-lg border-2 border-borderColor p-4 min-w-[200px] max-w-[300px] cursor-pointer">
      
      <div className='flex items-center mb-2 gap-4'>
        <Instagram size={32} />
        <div className='flex flex-col  justify-center'>
            <h4 className="font-bold text-sm ">{data.label}</h4>
            <p className='text-xs text-gray-300'>
            ID: <span className='text-gray-500 font-thin'>{data.id}</span>
            </p>
            <p className="text-xs text-gray-300 whitespace-normal break-words ">Send or receive messages, media, or data via Instagram</p>
        </div>
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default InstgramNode;