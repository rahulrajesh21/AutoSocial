import React, { useState, useCallback, useRef } from 'react';
import DragSidebar from '../components/SideBar/DragSidebar';
import WrappedCanvas from '../components/FlowCanvas';
import { useLocation } from 'react-router-dom';
import { SideBar } from '../components/SideBar';

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
    <div className="flex h-screen bg-primary">
      {/* Main Navigation Sidebar - forced to collapsed state */}
      <div className="h-full">
        <SideBar isAutomationsDesigner={true} />
      </div>
      
      {/* Flow Canvas Area */}
      <div className="flex-1 flex">
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
    </div>
  );
};

export default AutomationsDesigner;