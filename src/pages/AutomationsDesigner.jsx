import React, { useState, useCallback, useRef } from 'react';
import DragSidebar from '../components/SideBar/DragSidebar';
import WrappedCanvas from '../components/FlowCanvas'; 

const AutomationsDesigner = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const updateNodeFn = useRef(null);

  const handleNodeSelect = useCallback((node) => {
    setSelectedNode(node);
  }, []);

  const handleUpdateNode = useCallback((updatedNode) => {
    if (updateNodeFn.current) {
      updateNodeFn.current(updatedNode);
    }
  }, []);

  const registerUpdateNodeFn = useCallback((updateFn) => {
    updateNodeFn.current = updateFn;
  }, []);

  return (
    <div className="flex h-screen">
      <WrappedCanvas 
        onNodeSelect={handleNodeSelect} 
        onNodeUpdate={registerUpdateNodeFn} 
      />
      <DragSidebar 
        selectedNode={selectedNode} 
        onUpdateNode={handleUpdateNode} 
      />
    </div>
  );
};

export default AutomationsDesigner;