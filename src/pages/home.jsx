import React, { useEffect, useState } from 'react';
import { Plus, AlertCircle, Box, Zap, Filter, ArrowUpRight } from 'lucide-react';
import { AutomationCards } from '../components/cards/AutomationCards';
import CreateAutomation from '../components/popCards/CreateAutomation';
import { createWorkflow, getAllWorkflows } from '../utils/api';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Home = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [workflows, setWorkflows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'inactive'
  const { getToken } = useAuth();
  
  useEffect(() => {
    const fetchWorkflows = async () => {
      setIsLoading(true);
      try {
        const token = await getToken();
        const data = await getAllWorkflows(token);
        setWorkflows(data);
      } catch (err) {
        console.error('Error fetching workflows:', err);
        toast.error('Failed to fetch workflows');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkflows();
  }, [getToken]);
  
  const handleWorkflowSubmit = async (e) => { 
    e.preventDefault();
    try {
      const token = await getToken();  
      const data = await createWorkflow(name, description, token);
      toast.success('🎉 Workflow created successfully!');
      console.log('Workflow created:', data.data); 
      setWorkflows((prev) => [...prev, data.data]);
      setShowPopup(false);
      setName('');
      setDescription('');
    } catch (err) {
      toast.error(err.message || 'Failed to create workflow');
    }
  };

  // Filter workflows based on status
  const filteredWorkflows = workflows.filter(workflow => {
    if (filterStatus === 'all') return true;
    return filterStatus === 'active' ? workflow.status : !workflow.status;
  });
  
  // Count statistics
  const activeCount = workflows.filter(w => w.status).length;
  const inactiveCount = workflows.length - activeCount;
  
  // Skeleton loader for workflows
  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 h-32"></div>
      ))}
    </div>
  );

  return (
    <div className="h-full text-white overflow-y-auto pb-10">
      {/* Header Section */}
      <div className="relative">
        <div className="bg-gradient-to-r from-slate-900 via-blue-900/20 to-slate-900 pt-8 pb-16 px-6 rounded-b-3xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
              <p className="text-blue-200/80 text-sm">Manage and monitor your automated workflows</p>
            </div>
            <button
              onClick={() => setShowPopup(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/30 transform hover:-translate-y-0.5"
            >
              <Plus size={18} className="text-white" />
              <span className="font-medium text-sm">New Workflow</span>
            </button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 -mt-12">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-xl border border-slate-700 shadow-lg">
            <div className="flex justify-between">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Box size={20} className="text-blue-400" />
              </div>
              <span className="text-xs font-medium text-slate-400">Total</span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold">{workflows.length}</h3>
              <p className="text-slate-400 text-xs">Total Workflows</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-xl border border-slate-700 shadow-lg">
            <div className="flex justify-between">
              <div className="p-2 bg-green-600/20 rounded-lg">
                <Zap size={20} className="text-green-400" />
              </div>
              <span className="text-xs font-medium text-slate-400">Active</span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold">{activeCount}</h3>
              <p className="text-slate-400 text-xs">Active Workflows</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-xl border border-slate-700 shadow-lg">
            <div className="flex justify-between">
              <div className="p-2 bg-amber-600/20 rounded-lg">
                <AlertCircle size={20} className="text-amber-400" />
              </div>
              <span className="text-xs font-medium text-slate-400">Inactive</span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold">{inactiveCount}</h3>
              <p className="text-slate-400 text-xs">Inactive Workflows</p>
            </div>
          </div>
        </div>
      </div>

      {/* Workflows Section */}
      <div className="px-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Your Workflows</h2>
          
          <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button 
              onClick={() => setFilterStatus('all')} 
              className={`px-3 py-1.5 text-sm rounded-md transition-all ${filterStatus === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilterStatus('active')} 
              className={`px-3 py-1.5 text-sm rounded-md transition-all ${filterStatus === 'active' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Active
            </button>
            <button 
              onClick={() => setFilterStatus('inactive')} 
              className={`px-3 py-1.5 text-sm rounded-md transition-all ${filterStatus === 'inactive' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Inactive
            </button>
          </div>
        </div>

        {isLoading ? (
          <SkeletonLoader />
        ) : filteredWorkflows.length > 0 ? (
          <div className="space-y-4 animate-fadeIn">
            {filteredWorkflows.map((workflow) => (
              <AutomationCards key={workflow.id} workflow={workflow} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 border border-dashed border-slate-700 rounded-xl bg-slate-800/30">
            <div className="bg-slate-700/30 p-4 rounded-full mb-4">
              <Box size={32} className="text-slate-500" />
            </div>
            <h3 className="text-lg font-medium text-slate-300 mb-1">No workflows found</h3>
            <p className="text-slate-500 text-sm mb-4">
              {filterStatus !== 'all' 
                ? `No ${filterStatus} workflows found. Try changing your filter.` 
                : "You haven't created any workflows yet."}
            </p>
            {filterStatus === 'all' && (
              <button
                onClick={() => setShowPopup(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600/80 hover:bg-blue-600 rounded-lg text-sm font-medium transition-all"
              >
                <Plus size={16} />
                Create your first workflow
              </button>
            )}
          </div>
        )}
      </div>

      {showPopup && (
        <CreateAutomation
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          onClose={() => setShowPopup(false)}
          onSubmit={handleWorkflowSubmit}
        />
      )}
    </div>
  );
};

export default Home;