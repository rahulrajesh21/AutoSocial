import React, { useState, useEffect } from 'react';

const DragSidebar = ({ selectedNode, onUpdateNode }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [instagramLabel, setInstagramLabel] = useState('');
  const [isEditingNode, setIsEditingNode] = useState(false);

  // Update state when a node is selected from the canvas
  useEffect(() => {
    if (selectedNode) {
      setIsEditingNode(true);
      setSelectedType(selectedNode.type);
      if (selectedNode.type === 'gemini' && selectedNode.data) {
        setPrompt(selectedNode.data.prompt || '');
      } else if (selectedNode.type === 'instgram' && selectedNode.data) {
        setInstagramLabel(selectedNode.data.label || '');
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
      nodeData.label = instagramLabel || 'Instagram';
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
    } else if (type === 'instgram') {
      setInstagramLabel('Instagram'); // Default label
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

  const handleLabelChange = (e) => {
    const newLabel = e.target.value;
    setInstagramLabel(newLabel);
    
    // If editing an existing node, update it
    if (isEditingNode && selectedNode && selectedNode.type === 'instgram' && onUpdateNode) {
      onUpdateNode({
        ...selectedNode,
        data: {
          ...selectedNode.data,
          label: newLabel
        }
      });
    }
  };

  return (
    <aside className="w-64 bg-secondary text-white p-4 space-y-4">
      {!isEditingNode ? (
        <>
          <h3 className="text-lg font-medium mb-3">Add Nodes</h3>
          <div
            className="p-2 bg-gray-600 rounded cursor-move"
            onClick={() => handleClick('gemini')}
            onDragStart={(e) => onDragStart(e, 'gemini')}
            draggable
          >
            Gemini Node
          </div>
          <div
            className="p-2 bg-gray-600 rounded cursor-move"
            onClick={() => handleClick('instgram')}
            onDragStart={(e) => onDragStart(e, 'instgram')}
            draggable
          >
            Instagram Node
          </div>
        </>
      ) : (
        <>
          <h3 className="text-lg font-medium mb-3">
            {selectedNode?.type === 'gemini' ? 'Gemini Node Settings' : 
             selectedNode?.type === 'instgram' ? 'Instagram Node Settings' : 'Node Settings'}
          </h3>
          <div className="text-xs text-gray-400 mb-2">Node ID: {selectedNode?.id}</div>
        </>
      )}

      {selectedType === 'gemini' && (
        <div className="mt-4">
          <label className="block text-sm mb-1">
            {isEditingNode ? 'Edit Prompt:' : 'Prompt for Gemini Node:'}
          </label>
          <textarea
            value={prompt}
            onChange={handlePromptChange}
            className="w-full p-2 text-black rounded"
            rows={3}
            placeholder="Enter prompt..."
          />
        </div>
      )}

      {selectedType === 'instgram' && (
        <div className="mt-4">
          <label className="block text-sm mb-1">
            {isEditingNode ? 'Edit Label:' : 'Label for Instagram Node:'}
          </label>
          <input
            type="text"
            value={instagramLabel}
            onChange={handleLabelChange}
            className="w-full p-2 text-black rounded"
            placeholder="Enter label..."
          />
        </div>
      )}
    </aside>
  );
};

export default DragSidebar;