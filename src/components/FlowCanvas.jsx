import React, { useCallback, useState, useEffect, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import InstgramNode from '../custom_nodes/InstgramNode'; 
import GeminiNode from '../custom_nodes/geminiNode';

// Simple Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const FlowCanvas = ({ onNodeSelect, onNodeUpdate }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [rfInstance, setRfInstance] = useState(null);
  const fileInputRef = useRef(null);
  
  // Modal states
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [flowName, setFlowName] = useState('');
  const [savedFlows, setSavedFlows] = useState([]);

  // Load saved flows list on component mount
  useEffect(() => {
    const flowsList = localStorage.getItem('reactflow-saved-flows');
    if (flowsList) {
      try {
        const flows = JSON.parse(flowsList);
        setSavedFlows(flows);
      } catch (error) {
        console.error('Failed to load saved flows list:', error);
      }
    }
  }, []);

  // Load last used flow on component mount
  useEffect(() => {
    const lastFlow = localStorage.getItem('reactflow-last-flow');
    if (lastFlow) {
      try {
        const flow = JSON.parse(lastFlow);
        if (flow.nodes && flow.edges) {
          // Add onRun function to node data
          const nodesWithCallbacks = flow.nodes.map(node => ({
            ...node,
            data: {
              ...node.data,
              onRun: () => {
                console.log(`Running node ${node.id}`);
              }
            }
          }));
          
          setNodes(nodesWithCallbacks);
          setEdges(flow.edges);
        }
      } catch (error) {
        console.error('Failed to load last flow:', error);
      }
    }
  }, [setNodes, setEdges]);

  const onConnect = useCallback((connection) => {
    const edge = { ...connection, animated: true, id: `edge-${+new Date()}` };
    setEdges((eds) => addEdge(edge, eds));
  }, [setEdges]);

  const nodeTypes = {
    instgram: InstgramNode,
    gemini: GeminiNode
  };

  const onDrop = useCallback((event) => {
    event.preventDefault();

    const dataStr = event.dataTransfer.getData('application/reactflow');
    if (!dataStr) return;

    let parsed;
    try {
      parsed = JSON.parse(dataStr);
    } catch (err) {
      console.error("Invalid node data:", err);
      return;
    }

    const { nodeType, prompt, label } = parsed;
    if (!nodeType) return;

    const position = { x: event.clientX - 300, y: event.clientY - 50 }; 
    const id = `${+new Date()}`;
    
    let nodeData = {
      onRun: () => {
        console.log(`Running node ${id}`);
      }
    };

    // Add specific data based on node type
    if (nodeType === 'gemini') {
      nodeData.prompt = prompt || '';
    } else if (nodeType === 'instgram') {
      nodeData.label = label || 'Instagram';
    }

    const newNode = {
      id,
      type: nodeType,
      position,
      data: nodeData,
    };

    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNodeId(node.id);
    if (onNodeSelect) {
      onNodeSelect(node);
    }
  }, [onNodeSelect]);

  // Handle node updates from the sidebar
  React.useEffect(() => {
    if (onNodeUpdate) {
      onNodeUpdate((updatedNode) => {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === updatedNode.id) {
              return {
                ...node,
                data: {
                  ...node.data,
                  ...updatedNode.data,
                },
              };
            }
            return node;
          })
        );
      });
    }
  }, [onNodeUpdate, setNodes]);

  // Handle background click to deselect node
  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    if (onNodeSelect) {
      onNodeSelect(null);
    }
  }, [onNodeSelect]);

  // Get serializable flow data
  const getFlowData = useCallback(() => {
    if (!rfInstance) return null;
    
    const flow = rfInstance.toObject();
    
    // Clean up the flow data to ensure it's serializable
    return {
      nodes: flow.nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: {
          ...(node.type === 'gemini' ? { prompt: node.data.prompt || '' } : {}),
          ...(node.type === 'instgram' ? { label: node.data.label || 'Instagram' } : {})
        }
      })),
      edges: flow.edges
    };
  }, [rfInstance]);

  const onQuickSave = useCallback(() => {
    const flowData = getFlowData();
    if (flowData) {
      localStorage.setItem('reactflow-last-flow', JSON.stringify(flowData));
      alert('Flow saved successfully!');
    }
  }, [getFlowData]);

  const openSaveModal = () => {
    setFlowName('');
    setIsSaveModalOpen(true);
  };

  const saveNamedFlow = () => {
    if (!flowName.trim()) {
      alert('Please enter a name for your flow');
      return;
    }

    const flowData = getFlowData();
    if (flowData) {
      // Save the flow data
      localStorage.setItem(`reactflow-flow-${flowName}`, JSON.stringify(flowData));
      
      const updatedFlows = [...savedFlows.filter(f => f !== flowName), flowName];
      setSavedFlows(updatedFlows);
      localStorage.setItem('reactflow-saved-flows', JSON.stringify(updatedFlows));
      localStorage.setItem('reactflow-last-flow', JSON.stringify(flowData));
      
      setIsSaveModalOpen(false);
      alert(`Flow "${flowName}" saved successfully!`);
    }
  };

  const openLoadModal = () => {
    setIsLoadModalOpen(true);
  };

  const loadFlow = (name) => {
    const flowData = localStorage.getItem(`reactflow-flow-${name}`);
    if (flowData) {
      try {
        const flow = JSON.parse(flowData);
        if (flow.nodes && flow.edges) {
          // Add onRun function to node data
          const nodesWithCallbacks = flow.nodes.map(node => ({
            ...node,
            data: {
              ...node.data,
              onRun: () => {
                console.log(`Running node ${node.id}`);
              }
            }
          }));
          
          setNodes(nodesWithCallbacks);
          setEdges(flow.edges);
          
          // Also save as last flow
          localStorage.setItem('reactflow-last-flow', flowData);
          
          setIsLoadModalOpen(false);
          alert(`Flow "${name}" loaded successfully!`);
        }
      } catch (error) {
        console.error(`Failed to load flow "${name}":`, error);
        alert(`Failed to load flow "${name}"`);
      }
    }
  };

  const deleteFlow = (name, event) => {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete flow "${name}"?`)) {
      localStorage.removeItem(`reactflow-flow-${name}`);
      const updatedFlows = savedFlows.filter(f => f !== name);
      setSavedFlows(updatedFlows);
      localStorage.setItem('reactflow-saved-flows', JSON.stringify(updatedFlows));
    }
  };

  const onExport = useCallback(() => {
    const flowData = getFlowData();
    if (flowData) {
      const jsonString = JSON.stringify(flowData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'flow-diagram.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, [getFlowData]);

  const onImportClick = () => {
    fileInputRef.current?.click();
  };

  const onImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const flowData = JSON.parse(e.target.result);
        if (flowData.nodes && flowData.edges) {
          // Add onRun function to node data
          const nodesWithCallbacks = flowData.nodes.map(node => ({
            ...node,
            data: {
              ...node.data,
              onRun: () => {
                console.log(`Running node ${node.id}`);
              }
            }
          }));
          
          setNodes(nodesWithCallbacks);
          setEdges(flowData.edges);
          
          // Save as last flow
          localStorage.setItem('reactflow-last-flow', JSON.stringify(flowData));
          
          alert('Flow imported successfully!');
        } else {
          alert('Invalid flow data format');
        }
      } catch (error) {
        console.error('Failed to parse imported flow:', error);
        alert('Failed to import flow: Invalid JSON format');
      }
      
      // Reset file input
      event.target.value = '';
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="flex-1 h-screen bg-primary" onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onInit={setRfInstance}
      >
        <Background />
        <Controls />
        <Panel position="top-right" className="flex gap-2">
          <button 
            onClick={onQuickSave} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow-md"
          >
            Quick Save
          </button>
          <button 
            onClick={openSaveModal} 
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow-md"
          >
            Save As
          </button>
          <button 
            onClick={openLoadModal} 
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 shadow-md"
          >
            Load
          </button>
          <button 
            onClick={onExport} 
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 shadow-md"
          >
            Export
          </button>
          <button 
            onClick={onImportClick} 
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 shadow-md"
          >
            Import
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onImport}
            accept=".json"
            className="hidden"
          />
        </Panel>
      </ReactFlow>

      {/* Save Modal */}
      <Modal 
        isOpen={isSaveModalOpen} 
        onClose={() => setIsSaveModalOpen(false)} 
        title="Save Flow"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Flow Name
          </label>
          <input
            type="text"
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
            placeholder="Enter a name for your flow"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={saveNamedFlow}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </Modal>

      {/* Load Modal */}
      <Modal 
        isOpen={isLoadModalOpen} 
        onClose={() => setIsLoadModalOpen(false)} 
        title="Load Flow"
      >
        {savedFlows.length === 0 ? (
          <div className="text-gray-400">No saved flows found</div>
        ) : (
          <div className="max-h-60 overflow-y-auto">
            {savedFlows.map((name) => (
              <div 
                key={name}
                onClick={() => loadFlow(name)}
                className="flex justify-between items-center p-2 hover:bg-gray-700 rounded cursor-pointer mb-1"
              >
                <span className="text-white">{name}</span>
                <button
                  onClick={(e) => deleteFlow(name, e)}
                  className="text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

const WrappedCanvas = ({ onNodeSelect, onNodeUpdate }) => {
  return (
    <ReactFlowProvider>
      <FlowCanvas 
        onNodeSelect={onNodeSelect}
        onNodeUpdate={onNodeUpdate}
      />
    </ReactFlowProvider>
  );
};

export default WrappedCanvas;