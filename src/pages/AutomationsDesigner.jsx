import React, { useState, useCallback, useRef, useEffect } from 'react';
import DragSidebar from '../components/SideBar/DragSidebar';
import WrappedCanvas from '../components/FlowCanvas';
import { useLocation, useNavigate } from 'react-router-dom';
import { SideBar } from '../components/SideBar';
import { AlertTriangle, Laptop, ArrowLeft } from 'lucide-react';

// Mobile warning component specific to AutomationsDesigner
const MobileWarning = () => {
  const navigate = useNavigate();
  
  const handleGoBack = () => {
    navigate('/'); // Direct link back to home page
  };
  
  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 z-50 overflow-auto">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 sm:p-6 w-full max-w-sm sm:max-w-md text-center shadow-2xl animate-scaleIn mx-4">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 sm:p-4 bg-amber-900/30 rounded-full">
            <AlertTriangle size={36} className="text-amber-500" />
          </div>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Desktop Required</h2>
        <p className="text-slate-300 mb-5 sm:mb-6 text-sm sm:text-base">
          Our workflow designer requires a larger screen for the best experience. Please use a laptop or desktop computer to create and edit automations.
        </p>
        <div className="flex flex-col gap-4 items-center">
          <div className="flex items-center gap-2 text-amber-400 bg-amber-950/40 px-3 py-2 rounded-lg text-sm w-full justify-center">
            <Laptop size={18} />
            <span className="font-medium">Desktop only feature</span>
          </div>
          
          <button 
            onClick={handleGoBack}
            className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-3 px-5 rounded-lg transition-colors w-full text-sm font-medium"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const AutomationsDesigner = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const updateNodeFn = useRef(null);
  const location = useLocation();
  const workflowData = location.state?.workflowData;

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // If on mobile, display warning instead of the designer
  if (isMobile) {
    return <MobileWarning />;
  }

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