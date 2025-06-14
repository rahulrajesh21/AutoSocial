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
import InstagramNode from '../custom_nodes/InstgramNode'; 
import GeminiNode from '../custom_nodes/geminiNode';
import HelpDeskNode from '../custom_nodes/HelpDeskNode';
import { useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { updateTemplate, getWorkflowById } from '../utils/api';
import { toast } from 'react-toastify';

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
            className="text-gray-400 hover:text-white text-xl"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const FlowCanvas = ({ onNodeSelect, onNodeUpdate, workflowData }) => {
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
  const [loading, setLoading] = useState(false);
  
  const { id } = useParams();
  const { getToken } = useAuth();

  // Load saved flows list on component mount
  useEffect(() => {
    const loadSavedFlows = () => {
      try {
        const flowsList = localStorage.getItem(`reactflow-saved-flows-${id}`);
        if (flowsList) {
          const flows = JSON.parse(flowsList);
          setSavedFlows(Array.isArray(flows) ? flows : []);
        } else {
          setSavedFlows([]);
        }
      } catch (error) {
        console.error('Failed to load saved flows list:', error);
        setSavedFlows([]);
      }
    };

    loadSavedFlows();
  }, [id]);

  // FIXED: Node update handler
  const handleNodeUpdate = useCallback((updatedNodeData) => {
    console.log('handleNodeUpdate called with:', updatedNodeData);
    
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === updatedNodeData.id) {
          const updatedNode = {
            ...node,
            data: {
              ...node.data,
              ...updatedNodeData,
              // Preserve the callback functions
              onRun: node.data.onRun,
              onUpdate: node.data.onUpdate,
              onDataChange: node.data.onDataChange,
            },
          };
          console.log('Node updated:', updatedNode);
          return updatedNode;
        }
        return node;
      })
    );
  }, [setNodes]);

  // FIXED: Helper function to create nodes with proper callbacks
  const createNodeWithCallbacks = useCallback((node) => ({
    ...node,
    data: {
      ...node.data,
      onRun: () => {
        console.log(`Running node ${node.id}`);
      },
      onUpdate: handleNodeUpdate,
      onDataChange: (newData) => {
        console.log('onDataChange called with:', newData);
        // Ensure the ID is always included
        const dataWithId = {
          ...newData,
          id: newData.id || node.id
        };
        handleNodeUpdate(dataWithId);
      }
    }
  }), [handleNodeUpdate]);

  // Load flow data on component mount
  useEffect(() => {
    const loadFlowData = async () => {
      try {
        setLoading(true);
        
        // First check if we have workflowData passed from the parent component
        if (workflowData && workflowData.automation_template) {
          console.log('Loading flow from passed data:', workflowData.automation_template);
          const flow = workflowData.automation_template;
          
          if (flow.nodes && flow.edges) {
            const nodesWithCallbacks = flow.nodes.map(createNodeWithCallbacks);
            setNodes(nodesWithCallbacks);
            setEdges(flow.edges);
            
            localStorage.setItem(`reactflow-last-flow-${id}`, JSON.stringify(flow));
            toast.success('Flow loaded successfully');
            setLoading(false);
            return;
          }
        }
        
        // If no workflowData or invalid data, try to get data from the server
        if (!workflowData || !workflowData.automation_template) {
          console.log('No passed data, fetching from server');
          const token = await getToken();
          const serverWorkflowData = await getWorkflowById(token, id);
          
          if (serverWorkflowData && serverWorkflowData.automation_template) {
            console.log('Loading flow from server:', serverWorkflowData.automation_template);
            const flow = serverWorkflowData.automation_template;
            
            if (flow.nodes && flow.edges) {
              const nodesWithCallbacks = flow.nodes.map(createNodeWithCallbacks);
              setNodes(nodesWithCallbacks);
              setEdges(flow.edges);
              
              localStorage.setItem(`reactflow-last-flow-${id}`, JSON.stringify(flow));
              toast.success('Flow loaded from server');
              setLoading(false);
              return;
            }
          }
        }
        
        // Fallback to localStorage if server data is not available
        console.log('Server data not available, trying localStorage');
        const lastFlow = localStorage.getItem(`reactflow-last-flow-${id}`);
        if (lastFlow) {
          const flow = JSON.parse(lastFlow);
          if (flow.nodes && flow.edges) {
            const nodesWithCallbacks = flow.nodes.map(createNodeWithCallbacks);
            setNodes(nodesWithCallbacks);
            setEdges(flow.edges);
            toast.info('Flow loaded from local storage');
          }
        }
      } catch (error) {
        console.error('Failed to load flow data:', error);
        toast.error('Failed to load flow data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadFlowData();
    }
  }, [setNodes, setEdges, createNodeWithCallbacks, id, getToken, workflowData]);

  const onConnect = useCallback((connection) => {
    const edge = { ...connection, animated: true, id: `edge-${+new Date()}` };
    setEdges((eds) => addEdge(edge, eds));
  }, [setEdges]);

  const nodeTypes = {
    instgram: InstagramNode,
    gemini: GeminiNode,
    helpDesk: HelpDeskNode
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
    const nodeId = `${+new Date()}`;
    
    let nodeData = {
      id: nodeId,
    };

    if (nodeType === 'gemini') {
      nodeData.prompt = prompt || '';
    } else if (nodeType === 'instgram') {
      nodeData.label = label || 'Instagram';
      nodeData.selectedOption = null;
    } else if (nodeType === 'helpDesk') {
      nodeData.category = 'technical';
      nodeData.responseTemplate = '';
      nodeData.createTicket = true;
    }

    const newNode = {
      id: nodeId,
      type: nodeType,
      position,
      data: nodeData
    };

    // Apply callbacks to the new node
    const nodeWithCallbacks = createNodeWithCallbacks(newNode);
    setNodes((nds) => nds.concat(nodeWithCallbacks));
  }, [setNodes, createNodeWithCallbacks]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeClick = useCallback((event, node) => {
    if (event.defaultPrevented) return;
    
    setSelectedNodeId(node.id);
    if (onNodeSelect) {
      onNodeSelect(node);
    }
  }, [onNodeSelect]);

  React.useEffect(() => {
    if (onNodeUpdate) {
      onNodeUpdate(handleNodeUpdate);
    }
  }, [onNodeUpdate, handleNodeUpdate]);

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
    
    return {
      nodes: flow.nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: {
          id: node.data.id || node.id, 
          ...(node.type === 'gemini' ? { prompt: node.data.prompt || '' } : {}),
          ...(node.type === 'instgram' ? { 
            label: node.data.label || 'Instagram',
            selectedOption: node.data.selectedOption,
            ...(node.data.selectedPost ? {
              selectedPost: {
                id: node.data.selectedPost.id,
                caption: node.data.selectedPost.caption,
                media_type: node.data.selectedPost.media_type,
                mediaId: node.data.selectedPost.id,
                username: node.data.selectedPost.username || 'instagram_user',
                permalink: node.data.selectedPost.permalink
              }
            } : {})
          } : {}),
          ...(node.type === 'helpDesk' ? {
            category: node.data.category || 'technical',
            responseTemplate: node.data.responseTemplate || '',
            createTicket: node.data.createTicket !== false
          } : {})
        }
      })),
      edges: flow.edges
    };
  }, [rfInstance]);

  // Save flow to both local storage and server
  const saveFlowData = async (flowData, flowName = null) => {
    try {
      setLoading(true);
      
      const storageKey = flowName ? `reactflow-flow-${id}-${flowName}` : `reactflow-last-flow-${id}`;
      localStorage.setItem(storageKey, JSON.stringify(flowData));
      
      const token = await getToken();
      await updateTemplate(token, id, flowData);
      
      return true;
    } catch (error) {
      console.error('Failed to save flow:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const onQuickSave = useCallback(async () => {
    const flowData = getFlowData();
    if (!flowData) {
      alert('No flow data to save');
      return;
    }

    try {
      await saveFlowData(flowData);
      alert('Flow saved successfully!');
    } catch (error) {
      alert('Failed to save flow. Please try again.');
    }
  }, [getFlowData, id, getToken]);

  const openSaveModal = () => {
    setFlowName('');
    setIsSaveModalOpen(true);
  };

  const saveNamedFlow = async () => {
    if (!flowName.trim()) {
      alert('Please enter a name for your flow');
      return;
    }

    const flowData = getFlowData();
    if (!flowData) {
      alert('No flow data to save');
      return;
    }

    try {
      await saveFlowData(flowData, flowName);
      
      const updatedFlows = [...savedFlows.filter(f => f !== flowName), flowName];
      setSavedFlows(updatedFlows);
      localStorage.setItem(`reactflow-saved-flows-${id}`, JSON.stringify(updatedFlows));
      
      setIsSaveModalOpen(false);
      alert(`Flow "${flowName}" saved successfully!`);
    } catch (error) {
      alert(`Failed to save flow "${flowName}". Please try again.`);
    }
  };

  const openLoadModal = () => {
    setIsLoadModalOpen(true);
  };

  const loadFlow = async (name) => {
    try {
      setLoading(true);
      const flowData = localStorage.getItem(`reactflow-flow-${id}-${name}`);
      
      if (flowData) {
        const flow = JSON.parse(flowData);
        if (flow.nodes && flow.edges) {
          const nodesWithCallbacks = flow.nodes.map(createNodeWithCallbacks);
          setNodes(nodesWithCallbacks);
          setEdges(flow.edges);
          
          localStorage.setItem(`reactflow-last-flow-${id}`, flowData);
          setIsLoadModalOpen(false);
          alert(`Flow "${name}" loaded successfully!`);
        } else {
          throw new Error('Invalid flow data format');
        }
      } else {
        throw new Error('Flow not found');
      }
    } catch (error) {
      console.error(`Failed to load flow "${name}":`, error);
      alert(`Failed to load flow "${name}"`);
    } finally {
      setLoading(false);
    }
  };

  const deleteFlow = (name, event) => {
    event.stopPropagation();
    if (window.confirm(`Are you sure you want to delete flow "${name}"?`)) {
      localStorage.removeItem(`reactflow-flow-${id}-${name}`);
      
      const updatedFlows = savedFlows.filter(f => f !== name);
      setSavedFlows(updatedFlows);
      localStorage.setItem(`reactflow-saved-flows-${id}`, JSON.stringify(updatedFlows));
      
      alert(`Flow "${name}" deleted successfully!`);
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
      link.download = `flow-diagram-${id}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, [getFlowData, id]);

  const onImportClick = () => {
    fileInputRef.current?.click();
  };

  const onImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const flowData = JSON.parse(e.target.result);
        if (flowData.nodes && flowData.edges) {
          const nodesWithCallbacks = flowData.nodes.map(createNodeWithCallbacks);
          setNodes(nodesWithCallbacks);
          setEdges(flowData.edges);
          
          await saveFlowData(flowData);
          alert('Flow imported successfully!');
        } else {
          alert('Invalid flow data format');
        }
      } catch (error) {
        console.error('Failed to parse imported flow:', error);
        alert('Failed to import flow: Invalid JSON format');
      }
      
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
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow-md disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Quick Save'}
          </button>
          <button 
            onClick={openSaveModal} 
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow-md disabled:opacity-50"
          >
            Save As
          </button>
          <button 
            onClick={openLoadModal} 
            disabled={loading}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 shadow-md disabled:opacity-50"
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
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
            placeholder="Enter a name for your flow"
            onKeyPress={(e) => e.key === 'Enter' && saveNamedFlow()}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsSaveModalOpen(false)}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={saveNamedFlow}
            disabled={loading || !flowName.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </Modal>

      {/* Load Modal */}
      <Modal 
        isOpen={isLoadModalOpen} 
        onClose={() => setIsLoadModalOpen(false)} 
        title="Load Flow"
      >
        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : savedFlows.length === 0 ? (
          <div className="text-gray-400 text-center py-4">No saved flows found</div>
        ) : (
          <div className="max-h-60 overflow-y-auto">
            {savedFlows.map((name) => (
              <div 
                key={name}
                onClick={() => loadFlow(name)}
                className="flex justify-between items-center p-3 hover:bg-gray-700 rounded cursor-pointer mb-2 transition-colors"
              >
                <span className="text-white">{name}</span>
                <button
                  onClick={(e) => deleteFlow(name, e)}
                  className="text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-900/20 transition-colors"
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

const WrappedCanvas = ({ onNodeSelect, onNodeUpdate, workflowData }) => {
  return (
    <ReactFlowProvider>
      <FlowCanvas 
        onNodeSelect={onNodeSelect}
        onNodeUpdate={onNodeUpdate}
        workflowData={workflowData}
      />
    </ReactFlowProvider>
  );
};

export default WrappedCanvas;