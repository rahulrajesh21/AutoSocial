import React from 'react';
import { X } from 'lucide-react';

const CreateAutomation = ({ name, setName, description, setDescription, onClose, onSubmit }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-xl w-[90%] max-w-md p-6 animate-scaleIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Create Workflow</h2>
          <button 
            onClick={onClose} 
            className="p-1.5 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Workflow Name
            </label>
            <input
              type="text"
              placeholder="My Awesome Workflow"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              placeholder="Describe what this workflow does..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none h-24"
              required
            />
          </div>
          
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-blue-700/30"
            >
              Create Workflow
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAutomation;