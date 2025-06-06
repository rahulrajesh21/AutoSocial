import React, { useState, useCallback, useRef } from 'react';
import DragSidebar from '../components/SideBar/DragSidebar';
import WrappedCanvas from '../components/FlowCanvas';
import { useLocation } from 'react-router-dom';

const AutomationsDesigner = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const updateNodeFn = useRef(null);
  const location = useLocation();
  const workflowData = location.state?.workflowData;

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
        workflowData={workflowData}
      />
      <DragSidebar 
        selectedNode={selectedNode} 
        onUpdateNode={handleUpdateNode} 
      />
    </div>
  );
};

export default AutomationsDesigner;