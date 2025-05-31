import React, { useState, useEffect } from 'react';
import { Brain, Instagram, Settings, Edit3, Hash } from 'lucide-react';

const DragSidebar = ({ selectedNode, onUpdateNode }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [isEditingNode, setIsEditingNode] = useState(false);

  // Update state when a node is selected from the canvas
  useEffect(() => {
    if (selectedNode) {
      setIsEditingNode(true);
      setSelectedType(selectedNode.type);
      if (selectedNode.type === 'gemini' && selectedNode.data) {
        setPrompt(selectedNode.data.prompt || '');
      }
    } else {
      setIsEditingNode(false);
    }
  }, [selectedNode]);

  const onDragStart = (event, nodeType) => {
    let nodeData = { nodeType };
    if (nodeType === 'gemini') {
      nodeData.prompt = prompt;
    } else if (nodeType === 'instgram') {
      nodeData.label = 'Instagram'; // Fixed label
    }
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify(nodeData)
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleClick = (type) => {
    setSelectedType(type);
    setIsEditingNode(false);
    if (type === 'gemini') {
      setPrompt(''); // Reset prompt
    }
  };

  const handlePromptChange = (e) => {
    const newPrompt = e.target.value;
    setPrompt(newPrompt);
    // If editing an existing node, update it
    if (isEditingNode && selectedNode && selectedNode.type === 'gemini' && onUpdateNode) {
      onUpdateNode({
        ...selectedNode,
        data: {
          ...selectedNode.data,
          prompt: newPrompt
        }
      });
    }
  };

  const getNodeIcon = (type) => {
    switch (type) {
      case 'gemini':
        return <Brain size={20} className='text-indigo-400' />;
      case 'instgram':
        return <Instagram size={20} className='text-pink-400' />;
      default:
        return <Settings size={20} className='text-gray-400' />;
    }
  };

  const getNodeColor = (type) => {
    switch (type) {
      case 'gemini':
        return 'border-indigo-500/30 bg-indigo-500/10';
      case 'instgram':
        return 'border-pink-500/30 bg-pink-500/10';
      default:
        return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  return (
    <aside className="w-64 bg-primary border-l-2 border-borderColor text-white p-4 space-y-4">
      {!isEditingNode ? (
        <>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <p className='text-sm font-medium text-slate-300'>Available Actions</p>
          </div>
          
          <div
            className="flex p-3 bg-secondary border-2 border-borderColor rounded-lg cursor-move hover:border-indigo-500/50 transition-colors duration-200 group"
            onClick={() => handleClick('gemini')}
            onDragStart={(e) => onDragStart(e, 'gemini')}
            draggable
          >
            <div className='flex items-center mr-2 gap-3 w-full'>
              <div className="p-2 bg-indigo-500/20 rounded-lg group-hover:bg-indigo-500/30 transition-colors">
                <Brain size={20} className='text-indigo-400' />
              </div>
              <div className='flex-1'>
                <p className='text-sm font-semibold text-white'>Gemini AI</p>
                <p className='text-xs text-gray-400 leading-tight'>Generate AI responses</p>
              </div>
            </div>
          </div>

          <div
            className="flex p-3 bg-secondary border-2 border-borderColor rounded-lg cursor-move hover:border-pink-500/50 transition-colors duration-200 group"
            onClick={() => handleClick('instgram')}
            onDragStart={(e) => onDragStart(e, 'instgram')}
            draggable
          >
            <div className='flex items-center mr-2 gap-3 w-full'>
              <div className="p-2 bg-pink-500/20 rounded-lg group-hover:bg-pink-500/30 transition-colors">
                <Instagram size={20} className='text-pink-400' />
              </div>
              <div className='flex-1'>
                <p className='text-sm font-semibold text-white'>Instagram</p>
                <p className='text-xs text-gray-400 leading-tight'>Send or receive messages and media</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={`p-4 rounded-xl border-2 ${getNodeColor(selectedNode?.type)} backdrop-blur-sm`}>
            <div className="flex items-center gap-3 mb-3">
              {getNodeIcon(selectedNode?.type)}
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {selectedNode?.type === 'gemini' ? 'Gemini AI' :
                   selectedNode?.type === 'instgram' ? 'Instagram' : 'Node'} Settings
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Hash size={12} className="text-gray-400" />
                  <span className="text-xs text-gray-400 font-mono">{selectedNode?.id}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {selectedType === 'gemini' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Edit3 size={16} className="text-indigo-400" />
            <label className="text-sm font-medium text-gray-200">
              {isEditingNode ? 'Edit Prompt' : 'Configure Prompt'}
            </label>
          </div>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={handlePromptChange}
              className="w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none transition-colors resize-none"
              rows={4}
              placeholder="Enter your prompt for Gemini AI..."
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              {prompt.length} chars
            </div>
          </div>
          {prompt && (
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-md">
              <p className="text-xs text-indigo-300">✓ Prompt configured</p>
            </div>
          )}
        </div>
      )}

      {selectedType === 'instgram' && isEditingNode && (
        <div className="space-y-3">
          <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Instagram size={16} className="text-pink-400" />
              <p className="text-sm font-medium text-pink-300">Instagram Node</p>
            </div>
            <p className="text-xs text-gray-400">
              This node handles Instagram messaging and media operations. No additional configuration required.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default DragSidebar;