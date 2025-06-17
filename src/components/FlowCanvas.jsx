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
  MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import InstagramNode from '../custom_nodes/InstgramNode'; 
import GeminiNode from '../custom_nodes/geminiNode';
import HelpDeskNode from '../custom_nodes/HelpDeskNode';
import TriggerNode from '../custom_nodes/TriggerNode';
import TextNode from '../custom_nodes/TextNode';
import { useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { updateTemplate, getWorkflowById } from '../utils/api';
import { toast } from 'react-toastify';
import { 
  Save, 
  FileDown, 
  FileUp, 
  List, 
  LoaderCircle,
  Save as SaveAs,
  X,
  Trash2
} from 'lucide-react';

// Enhanced Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-slate-800 rounded-xl p-6 w-96 max-w-full shadow-2xl border border-slate-700 animate-scaleIn">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white rounded-full p-1 hover:bg-slate-700 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};

// Button component for consistent styling
const Button = ({ onClick, disabled, variant = 'primary', icon, children, className = '' }) => {
  const baseClasses = "flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800",
    warning: "bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700",
    danger: "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800",
    secondary: "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800",
    tertiary: "bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800",
    ghost: "bg-slate-700/40 text-white hover:bg-slate-700/80 active:bg-slate-700"
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
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

  // Node types
  const nodeTypes = {
    instgram: InstagramNode,
    gemini: GeminiNode,
    helpDesk: HelpDeskNode,
    trigger: TriggerNode,
    text: TextNode,
  };
  
  // Default edge options
  const defaultEdgeOptions = {
    animated: true,
    style: {
      stroke: '#94a3b8',
      strokeWidth: 2,
    },
  };

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
  
  // Node update handler
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

  // Helper function to create nodes with proper callbacks
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
  
  // Event handlers for drag-and-drop - SIMPLIFIED as requested
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

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

    // Simple position calculation with fixed offset from sidebar
    const position = { x: event.clientX - 300, y: event.clientY - 50 };
    const nodeId = `${nodeType}_${Date.now()}`;
    
    let nodeData = {
      id: nodeId,
      label: label || `${nodeType} node`
    };

    if (nodeType === 'gemini') {
      nodeData.prompt = prompt || '';
      nodeData.temperature = 0.7;
      nodeData.maxTokens = 1000;
    } else if (nodeType === 'instgram') {
      nodeData.selectedOption = parsed.selectedOption || 'get-posts';
      nodeData.username = '';
      nodeData.postsCount = 5;
    } else if (nodeType === 'helpDesk') {
      nodeData.category = parsed.category || 'technical';
      nodeData.createTicket = parsed.createTicket || true;
      nodeData.priority = 'medium';
    } else if (nodeType === 'trigger') {
      nodeData.triggerWord = parsed.triggerWord || '';
      nodeData.caseSensitive = parsed.caseSensitive || false;
    } else if (nodeType === 'text') {
      nodeData.text = parsed.text || '';
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
    const edge = { 
      ...connection, 
      animated: true, 
      id: `edge-${+new Date()}`,
      style: { stroke: '#6366f1', strokeWidth: 2 },
      labelBgStyle: { fill: '#1e293b', color: '#fff', fillOpacity: 0.7 },
      labelBgPadding: [8, 4],
      labelBgBorderRadius: 4,
    };
    setEdges((eds) => addEdge(edge, eds));
  }, [setEdges]);

  const onNodeClick = useCallback((event, node) => {
    if (event.defaultPrevented) return;
    
    setSelectedNodeId(node.id);
    if (onNodeSelect) {
      onNodeSelect(node);
    }
  }, [onNodeSelect]);

  useEffect(() => {
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
          } : {}),
          ...(node.type === 'trigger' ? {
            triggerWord: node.data.triggerWord || '',
            caseSensitive: node.data.caseSensitive || false
          } : {}),
          ...(node.type === 'text' ? {
            text: node.data.text || ''
          } : {})
        }
      })),
      edges: flow.edges
    };
  }, [rfInstance]);

  // Save flow to both local storage and server
  const saveFlowData = useCallback(async (flowData, flowName = null) => {
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
  }, [id, getToken]);

  const onQuickSave = useCallback(async () => {
    const flowData = getFlowData();
    if (!flowData) {
      toast.error('No flow data to save');
      return;
    }

    try {
      await saveFlowData(flowData);
      toast.success('Flow saved successfully!');
    } catch (error) {
      toast.error('Failed to save flow. Please try again.');
    }
  }, [getFlowData, saveFlowData]);

  const openSaveModal = () => {
    setFlowName('');
    setIsSaveModalOpen(true);
  };

  const saveNamedFlow = async () => {
    if (!flowName.trim()) {
      toast.error('Please enter a name for your flow');
      return;
    }

    const flowData = getFlowData();
    if (!flowData) {
      toast.error('No flow data to save');
      return;
    }

    try {
      await saveFlowData(flowData, flowName);
      
      const updatedFlows = [...savedFlows.filter(f => f !== flowName), flowName];
      setSavedFlows(updatedFlows);
      localStorage.setItem(`reactflow-saved-flows-${id}`, JSON.stringify(updatedFlows));
      
      setIsSaveModalOpen(false);
      toast.success(`Flow "${flowName}" saved successfully!`);
    } catch (error) {
      toast.error(`Failed to save flow "${flowName}". Please try again.`);
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
          toast.success(`Flow "${name}" loaded successfully!`);
        } else {
          throw new Error('Invalid flow data format');
        }
      } else {
        throw new Error('Flow not found');
      }
    } catch (error) {
      console.error(`Failed to load flow "${name}":`, error);
      toast.error(`Failed to load flow "${name}"`);
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
      
      toast.success(`Flow "${name}" deleted`);
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
      
      toast.info('Flow exported successfully');
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
          toast.success('Flow imported successfully!');
        } else {
          toast.error('Invalid flow data format');
        }
      } catch (error) {
        console.error('Failed to parse imported flow:', error);
        toast.error('Failed to import flow: Invalid JSON format');
      }
      
      event.target.value = '';
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="flex-1 h-full flex bg-slate-900 relative overflow-hidden" onDrop={onDrop} onDragOver={onDragOver}>
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
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      >
        <Background 
          color="#4b5563" 
          gap={24} 
          size={1.5}
          variant="dots" 
        />
        <Controls className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-1" />
        <MiniMap 
          nodeStrokeColor={(n) => {
            if (n.id === selectedNodeId) return '#22c55e';
            return '#6366f1';
          }}
          nodeColor={(n) => {
            switch (n.type) {
              case 'instgram':
                return '#ec4899';
              case 'trigger':
                return '#f97316'; 
              case 'gemini':
                return '#06b6d4';
              case 'helpDesk':
                return '#22c55e';
              case 'text':
                return '#3b82f6';
              default:
                return '#64748b';
            }
          }}
          maskColor="rgba(15, 23, 42, 0.5)"
          className="bg-slate-800/80 border border-slate-700 rounded-lg shadow-lg"
          style={{ right: 12, bottom: 12 }}
        />
        
        {/* Top toolbar */}
        <Panel position="top" className="w-full p-2 flex justify-center items-center">
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg p-2 flex gap-2">
            <Button
              onClick={onQuickSave}
              disabled={loading}
              variant="primary"
              icon={loading ? <LoaderCircle className="animate-spin" size={16} /> : <Save size={16} />}
            >
              {loading ? 'Saving...' : 'Quick Save'}
            </Button>
            <Button
              onClick={openSaveModal}
              disabled={loading}
              variant="success"
              icon={<SaveAs size={16} />}
            >
              Save As
            </Button>
            <Button
              onClick={openLoadModal}
              disabled={loading}
              variant="warning"
              icon={<List size={16} />}
            >
              Load
            </Button>
            <div className="h-6 w-px bg-slate-600 mx-1" />
            <Button
              onClick={onExport}
              variant="secondary"
              icon={<FileDown size={16} />}
            >
              Export
            </Button>
            <Button
              onClick={onImportClick}
              variant="tertiary"
              icon={<FileUp size={16} />}
            >
              Import
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={onImport}
              accept=".json"
              className="hidden"
            />
          </div>
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
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400"
            placeholder="Enter a name for your flow"
            onKeyPress={(e) => e.key === 'Enter' && saveNamedFlow()}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            onClick={() => setIsSaveModalOpen(false)}
            variant="ghost"
          >
            Cancel
          </Button>
          <Button
            onClick={saveNamedFlow}
            disabled={loading || !flowName.trim()}
            variant="success"
            icon={loading ? <LoaderCircle className="animate-spin" size={16} /> : <Save size={16} />}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </Modal>

      {/* Load Modal */}
      <Modal 
        isOpen={isLoadModalOpen} 
        onClose={() => setIsLoadModalOpen(false)} 
        title="Load Flow"
      >
        {loading ? (
          <div className="flex items-center justify-center py-6 text-slate-400">
            <LoaderCircle className="animate-spin mr-2" size={20} />
            <span>Loading...</span>
          </div>
        ) : savedFlows.length === 0 ? (
          <div className="text-slate-400 text-center py-6">No saved flows found</div>
        ) : (
          <div className="max-h-80 overflow-y-auto pr-1 space-y-2">
            {savedFlows.map((name) => (
              <div 
                key={name}
                onClick={() => loadFlow(name)}
                className="group flex justify-between items-center px-4 py-3 bg-slate-700/60 hover:bg-slate-600 rounded-lg cursor-pointer transition-colors border border-slate-600 hover:border-slate-500"
              >
                <span className="text-white font-medium">{name}</span>
                <button
                  onClick={(e) => deleteFlow(name, e)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 p-1 rounded-md hover:bg-red-900/30 transition-all"
                  aria-label="Delete flow"
                >
                  <Trash2 size={16} />
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