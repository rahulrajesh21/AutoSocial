import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { updateAutomationStatus } from '../../utils/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { ExternalLink, Instagram, Facebook, ArrowRight, Clock } from 'lucide-react';

export const AutomationCards = ({workflow}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const { getToken } = useAuth();
  
  // Initialize status from workflow data
  useEffect(() => {
    if (workflow && workflow.status !== undefined) {
      setIsEnabled(workflow.status);
    }
  }, [workflow]);

  const handleToggleStatus = async (newStatus, event) => {
    // Stop event propagation to prevent the Link navigation
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    try {
      const token = await getToken();
      await updateAutomationStatus(token, workflow.id, newStatus);
      setIsEnabled(newStatus);
      toast.success(`Automation ${newStatus ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Error updating automation status:', error);
      toast.error('Failed to update automation status');
      // Revert UI state on failure
      setIsEnabled(!newStatus);
    }
  };

  // Calculate time since creation (just for UI demonstration)
  const getTimeAgo = () => {
    const createdAt = workflow.createdAt ? new Date(workflow.createdAt) : new Date();
    const now = new Date();
    const diffInDays = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 1) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const CustomToggle = ({ checked, onChange }) => (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onChange(!checked, e);
      }}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full 
        transition-all duration-300 ease-in-out
        ${
          checked
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-600/20'
            : 'bg-slate-700 hover:bg-slate-600'
        }
      `}
      style={{
        boxShadow: checked ? '0 0 12px rgba(37, 99, 235, 0.3)' : 'none',
      }}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white 
          transition-all duration-300 ease-out shadow-md
          ${checked ? 'translate-x-6 scale-110' : 'translate-x-1'}
        `}
        style={{
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
        }}
      />
    </button>
  );

  // Mock platforms data, assume workflow connects to these platforms
  const platforms = ['instagram', 'facebook'];

  return (
    <div className="group">
      <Link 
        to={`/AutomationsDesigner/${workflow.id}`} 
        state={{ workflowData: workflow }}
        className="block no-underline"
      >
        <div className="relative bg-slate-800/80 hover:bg-gradient-to-r hover:from-slate-800 hover:via-slate-800/95 hover:to-blue-900/20 border border-slate-700 rounded-xl overflow-hidden transition-all duration-300 group-hover:shadow-md group-hover:shadow-blue-900/10 group-hover:border-blue-900/30">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:from-blue-600 group-hover:via-indigo-600 group-hover:to-purple-600 transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
          
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  {platforms.includes('instagram') && (
                    <div className="p-1.5 bg-pink-500/10 rounded-lg">
                      <Instagram size={14} className="text-pink-400" />
                    </div>
                  )}
                  {platforms.includes('facebook') && (
                    <div className="p-1.5 bg-blue-500/10 rounded-lg">
                      <Facebook size={14} className="text-blue-400" />
                    </div>
                  )}
                  <div className="flex items-center text-xs text-slate-500 gap-1">
                    <Clock size={12} />
                    <span>{getTimeAgo()}</span>
                  </div>
                </div>

                <h2 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-100 transition-colors duration-300">
                  {workflow.name || 'Unnamed Workflow'}
                </h2>
                <p className="text-slate-400 text-sm line-clamp-2 transition-colors duration-300 group-hover:text-slate-300">
                  {workflow.description || 'No description provided.'}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-medium ${isEnabled ? 'text-blue-400' : 'text-slate-500'}`}>
                    {isEnabled ? 'Active' : 'Inactive'}
                  </span>
                  <CustomToggle checked={isEnabled} onChange={handleToggleStatus} />
                </div>

                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="flex items-center gap-1 text-xs text-blue-400 font-medium">
                    Open Designer
                    <ArrowRight size={12} className="transform group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AutomationCards;
