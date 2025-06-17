import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  AlertCircle, 
  Box, 
  Zap, 
  Filter, 
  ArrowUpRight, 
  Sparkles, 
  LayoutTemplate, 
  Clipboard, 
  Clock,
  MessageSquare,
  Users,
  TrendingUp,
  Star,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { AutomationCards } from '../components/cards/AutomationCards';
import CreateAutomation from '../components/popCards/CreateAutomation';
import { createWorkflow, getAllWorkflows } from '../utils/api';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

// Premade templates data
const premadeTemplates = [
  {
    id: 'template-1',
    title: 'Customer Support',
    description: 'Auto-respond to Instagram comments and create support tickets',
    icon: <MessageSquare size={18} className="text-pink-400" />,
    tags: ['Instagram', 'Support', 'Automation'],
    category: 'support',
    popularity: 'high'
  },
  {
    id: 'template-2',
    title: 'Content Generator',
    description: 'Generate social posts with AI based on your brand guidelines',
    icon: <Sparkles size={18} className="text-indigo-400" />,
    tags: ['AI', 'Content', 'Marketing'],
    category: 'marketing',
    popularity: 'high'
  },
  {
    id: 'template-3',
    title: 'Lead Qualification',
    description: 'Qualify leads from social media messages and comments',
    icon: <Users size={18} className="text-emerald-400" />,
    tags: ['Sales', 'Leads', 'Qualification'],
    category: 'sales',
    popularity: 'medium'
  },
  {
    id: 'template-4',
    title: 'Post Scheduler',
    description: 'Schedule and post content across multiple platforms',
    icon: <Clock size={18} className="text-amber-400" />,
    tags: ['Scheduling', 'Posts', 'Management'],
    category: 'scheduling',
    popularity: 'medium'
  }
];

// Template suggestion categories
const suggestions = {
  'new-user': [
    'template-1', // Customer Support
    'template-2', // Content Generator
  ],
  'marketing': [
    'template-2', // Content Generator
    'template-4', // Post Scheduler
  ],
  'support': [
    'template-1', // Customer Support
    'template-3', // Lead Qualification
  ]
};

// Related templates mapping
const relatedTemplates = {
  'template-1': ['template-3'], // Customer Support -> Lead Qualification
  'template-2': ['template-4'], // Content Generator -> Post Scheduler
  'template-3': ['template-1'], // Lead Qualification -> Customer Support
  'template-4': ['template-2'], // Post Scheduler -> Content Generator
};
//fix
const Home = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [workflows, setWorkflows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'inactive'
  const [templateCategory, setTemplateCategory] = useState('all'); // 'all', 'support', 'marketing', 'sales', 'scheduling'
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [hoverState, setHoverState] = useState({ id: null, isHovered: false });
  const [templateDetailView, setTemplateDetailView] = useState(null); // Store the template id for detail view
  const [suggestionCategory, setSuggestionCategory] = useState('new-user'); // Default suggestion category
  const { getToken } = useAuth();
  
 useEffect(() => {
    const fetchWorkflows = async () => {
      setIsLoading(true);
      try {
        const token = await getToken();
        const data = await getAllWorkflows(token);
        
        // Check if data exists and set workflows accordingly
        if (data) {
        setWorkflows(data);
        } else {
          // If API returns null/undefined but didn't throw error, it means no workflows yet
          setWorkflows([]);
        }
      } catch (err) {
        console.error('Error fetching workflows:', err);
        // Only show error toast for actual API failures, not empty states
        if (err.message && err.message !== 'No workflows found') {
        toast.error('Failed to fetch workflows');
        } else {
          // Reset to empty array in case of "no workflows" error
          setWorkflows([]);
        }
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
      setSelectedTemplate(null);
      
      // Refresh workflows list after a short delay to ensure it's updated on the server
      setTimeout(async () => {
        try {
          const token = await getToken();
          const refreshedData = await getAllWorkflows(token);
          if (refreshedData) {
            setWorkflows(refreshedData);
          }
        } catch (err) {
          console.error('Error refreshing workflows:', err);
        }
      }, 500);
    } catch (err) {
      toast.error(err.message || 'Failed to create workflow');
    }
  };

  // Filter workflows based on status
  const filteredWorkflows = workflows.filter(workflow => {
    if (filterStatus === 'all') return true;
    return filterStatus === 'active' ? workflow.status : !workflow.status;
  });
  
  // Filter templates based on category
  const filteredTemplates = templateCategory === 'all' 
    ? premadeTemplates 
    : premadeTemplates.filter(template => template.category === templateCategory);
  
  // Count statistics
  const activeCount = workflows.filter(w => w.status).length;
  const inactiveCount = workflows.length - activeCount;
  
  // Handle template selection
  const handleTemplateSelect = (template) => {
    setName(`${template.title} Workflow`);
    setDescription(`Based on ${template.title} template: ${template.description}`);
    setSelectedTemplate(template);
    setShowPopup(true);
    toast.info(`Selected template: ${template.title}`);
    closeTemplateDetail(); // Close detail view if open
  };

  // Toggle between workflows and templates
  const toggleView = () => {
    setShowTemplates(!showTemplates);
  };
  
  // Handle hover state
  const handleHover = (id, isHovered) => {
    setHoverState({ id, isHovered });
  };
  
  // Find a template by its ID
  const findTemplateById = (id) => {
    return premadeTemplates.find(template => template.id === id);
  };
  
  // View template details
  const viewTemplateDetail = (template) => {
    setTemplateDetailView(template.id);
    
    // Determine the suggestion category based on template category
    if (template.category === 'marketing') {
      setSuggestionCategory('marketing');
    } else if (template.category === 'support') {
      setSuggestionCategory('support');
    } else {
      setSuggestionCategory('new-user');
    }
  };
  
  // Close template detail view
  const closeTemplateDetail = () => {
    setTemplateDetailView(null);
  };
  
  // Get suggested templates based on category
  const getSuggestedTemplates = () => {
    const suggestedIds = suggestions[suggestionCategory] || [];
    // Get templates based on the suggestedIds
    const suggestedTemplates = suggestedIds.map(id => findTemplateById(id)).filter(Boolean);
    
    // If we have fewer than 3 templates, add templates from other categories to fill the grid
    if (suggestedTemplates.length < 3) {
      const remainingCount = 3 - suggestedTemplates.length;
      const existingIds = suggestedTemplates.map(t => t.id);
      
      // Get templates from other categories that aren't already included
      const additionalTemplates = premadeTemplates
        .filter(t => !existingIds.includes(t.id))
        .slice(0, remainingCount);
        
      return [...suggestedTemplates, ...additionalTemplates];
    }
    
    return suggestedTemplates;
  };
  
  // Get related templates for the current template
  const getRelatedTemplates = () => {
    if (!templateDetailView) return [];
    const relatedIds = relatedTemplates[templateDetailView] || [];
    return relatedIds.map(id => findTemplateById(id)).filter(Boolean);
  };
  
  // Skeleton loader for workflows
  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 h-32">
          <div className="h-4 bg-slate-700 rounded w-1/3 mb-3"></div>
          <div className="h-3 bg-slate-700/80 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-slate-700/60 rounded w-1/2"></div>
          <div className="flex justify-end mt-6">
            <div className="h-6 w-6 bg-slate-700/50 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-full text-white overflow-y-auto pb-10">
      {/* Animated Background Shapes */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[40%] -right-[30%] w-[80%] h-[80%] rounded-full blur-[120px] bg-blue-900/20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-[40%] -left-[30%] w-[80%] h-[80%] rounded-full blur-[120px] bg-indigo-900/20 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Header Section */}
      <div className="relative">
        <div className="bg-gradient-to-r from-slate-900 via-blue-900/20 to-slate-900 pt-10 pb-20 px-6 rounded-b-[2.5rem] shadow-lg">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
              <div className="relative">
                <div className="absolute -top-6 -left-2 bg-blue-500/10 w-12 h-12 rounded-full blur-xl"></div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-1 tracking-tight">Dashboard</h1>
                <p className="text-blue-200/80 text-sm md:text-base max-w-md">
                  Manage and monitor your automated workflows with real-time insights
                </p>
                
                {/* Quick Stats Summary */}
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="text-xs text-green-300">{activeCount} Active</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                    <span className="text-xs text-amber-300">{inactiveCount} Inactive</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <span className="text-xs text-blue-300">{workflows.length} Total</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={toggleView}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-all duration-200 border border-slate-700 backdrop-blur-sm"
                >
                  {showTemplates ? (
                    <>
                      <Box size={18} className="text-blue-400" />
                      <span className="font-medium text-sm">View Workflows</span>
                    </>
                  ) : (
                    <>
                      <LayoutTemplate size={18} className="text-indigo-400" />
                      <span className="font-medium text-sm">View Templates</span>
                    </>
                  )}
                </button>
        <button
                  onClick={() => {
                    setSelectedTemplate(null);
                    setShowPopup(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/30 transform hover:-translate-y-0.5"
                >
                  <Plus size={18} className="text-white" />
                  <span className="font-medium text-sm">New Workflow</span>
        </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 -mt-12 max-w-screen-xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-xl border border-slate-700/80 shadow-xl hover:shadow-2xl hover:border-blue-500/20 transition-all duration-300 group">
            <div className="flex justify-between">
              <div className="p-2 bg-blue-600/20 rounded-lg group-hover:bg-blue-500/30 transition-all duration-300">
                <Box size={20} className="text-blue-400 group-hover:text-blue-300" />
              </div>
              <div className="relative">
                <TrendingUp size={24} className="text-blue-500/10 absolute -top-1 -right-1 group-hover:scale-125 transition-all duration-300" />
                <span className="text-xs font-medium text-slate-400">Total</span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold group-hover:text-blue-300 transition-colors">{workflows.length}</h3>
              <p className="text-slate-400 text-xs">Total Workflows</p>
            </div>
            <div className="w-full h-1 bg-slate-700/50 mt-3 rounded-full overflow-hidden">
              <div className="h-1 bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-xl border border-slate-700/80 shadow-xl hover:shadow-2xl hover:border-green-500/20 transition-all duration-300 group">
            <div className="flex justify-between">
              <div className="p-2 bg-green-600/20 rounded-lg group-hover:bg-green-500/30 transition-all duration-300">
                <Zap size={20} className="text-green-400 group-hover:text-green-300" />
              </div>
              <div className="relative">
                <TrendingUp size={24} className="text-green-500/10 absolute -top-1 -right-1 group-hover:scale-125 transition-all duration-300" />
                <span className="text-xs font-medium text-slate-400">Active</span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold group-hover:text-green-300 transition-colors">{activeCount}</h3>
              <p className="text-slate-400 text-xs">Active Workflows</p>
            </div>
            <div className="w-full h-1 bg-slate-700/50 mt-3 rounded-full overflow-hidden">
              <div className="h-1 bg-green-500 rounded-full" style={{ width: `${workflows.length ? (activeCount / workflows.length) * 100 : 0}%` }}></div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-xl border border-slate-700/80 shadow-xl hover:shadow-2xl hover:border-amber-500/20 transition-all duration-300 group">
            <div className="flex justify-between">
              <div className="p-2 bg-amber-600/20 rounded-lg group-hover:bg-amber-500/30 transition-all duration-300">
                <AlertCircle size={20} className="text-amber-400 group-hover:text-amber-300" />
              </div>
              <div className="relative">
                <TrendingUp size={24} className="text-amber-500/10 absolute -top-1 -right-1 group-hover:scale-125 transition-all duration-300" />
                <span className="text-xs font-medium text-slate-400">Inactive</span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold group-hover:text-amber-300 transition-colors">{inactiveCount}</h3>
              <p className="text-slate-400 text-xs">Inactive Workflows</p>
            </div>
            <div className="w-full h-1 bg-slate-700/50 mt-3 rounded-full overflow-hidden">
              <div className="h-1 bg-amber-500 rounded-full" style={{ width: `${workflows.length ? (inactiveCount / workflows.length) * 100 : 0}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6">
        {showTemplates ? (
          /* Templates Section */
          <div className="mt-12">
            {templateDetailView ? (
              /* Template Detail View */
              <>
                {(() => {
                  const template = findTemplateById(templateDetailView);
                  if (!template) return null;
                  
                  return (
                    <div className="animate-fadeIn">
                      {/* Back button */}
                      <button
                        onClick={closeTemplateDetail}
                        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
                      >
                        <ChevronRight className="rotate-180" size={16} />
                        <span>Back to all templates</span>
                      </button>
                      
                      {/* Template Detail */}
                      <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700 rounded-2xl p-8 mb-8">
                        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
                          <div className="p-6 rounded-xl bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-slate-700">
                            <div className="p-4 bg-slate-900/70 rounded-lg shadow-inner">
                              {template.icon}
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h2 className="text-2xl font-bold text-white">{template.title}</h2>
                              {template.popularity === 'high' && (
                                <span className="bg-blue-500/20 text-blue-300 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                                  <Star size={12} fill="currentColor" />
                                  <span>Popular</span>
                                </span>
                              )}
                            </div>
                            <p className="text-slate-300 mb-4">{template.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-6">
                              {template.tags.map(tag => (
                                <span key={tag} className="px-2.5 py-1 bg-slate-700/60 rounded-md text-xs text-slate-300">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleTemplateSelect(template)}
                                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg text-sm font-medium transition-all"
                              >
                                Use this template
                              </button>
                              <button
                                className="px-5 py-2.5 bg-slate-700/60 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm font-medium transition-all text-slate-300"
                              >
                                Preview
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Related Templates */}
                      {getRelatedTemplates().length > 0 && (
                        <div className="mb-10">
                          <h3 className="text-lg font-semibold text-white mb-4">Related Templates</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {getRelatedTemplates().map(template => (
                              <div 
                                key={template.id}
                                className="bg-slate-800/60 border border-slate-700/60 hover:border-blue-500/30 rounded-xl p-4 transition-all duration-200 cursor-pointer transform hover:-translate-y-1 hover:shadow-lg"
                                onClick={() => viewTemplateDetail(template)}
                              >
                                <div className="flex gap-4 items-center">
                                  <div className="p-2 rounded-lg bg-slate-700/50 flex-shrink-0">
                                    {template.icon}
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-white">{template.title}</h4>
                                    <p className="text-sm text-slate-400 line-clamp-1">{template.description}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </>
            ) : (
              /* Templates List View */
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                      <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Workflow Templates</h2>
                    </div>
                    <p className="text-slate-400 text-sm mt-1 ml-3">Get started quickly with pre-built workflow templates</p>
                  </div>
                  
                  <div className="flex items-center mt-4 sm:mt-0 bg-slate-800/80 rounded-lg p-1 border border-slate-700/80 backdrop-blur-sm">
                    <button 
                      onClick={() => setTemplateCategory('all')} 
                      className={`px-3 py-1.5 text-sm rounded-md transition-all ${templateCategory === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      All
                    </button>
                    <button 
                      onClick={() => setTemplateCategory('support')} 
                      className={`px-3 py-1.5 text-sm rounded-md transition-all ${templateCategory === 'support' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      Support
                    </button>
                    <button 
                      onClick={() => setTemplateCategory('marketing')} 
                      className={`px-3 py-1.5 text-sm rounded-md transition-all ${templateCategory === 'marketing' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      Marketing
                    </button>
                    <button 
                      onClick={() => setTemplateCategory('sales')} 
                      className={`px-3 py-1.5 text-sm rounded-md transition-all ${templateCategory === 'sales' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      Sales
                    </button>
                  </div>
                </div>

                {/* All Templates Grid */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">All Templates</h3>
                    
                    {templateCategory !== 'all' && (
                      <span className="text-sm text-slate-400">
                        Showing: <span className="text-blue-400 font-medium capitalize">{templateCategory}</span>
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredTemplates.map(template => (
                      <div 
                        key={template.id}
                        className="relative bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 hover:border-blue-500/50 rounded-xl p-5 transition-all duration-300 cursor-pointer group transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-700/10"
                        onClick={() => viewTemplateDetail(template)}
                        onMouseEnter={() => handleHover(template.id, true)}
                        onMouseLeave={() => handleHover(template.id, false)}
                      >
                        {/* Subtle design elements */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-indigo-500/0 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition duration-700"></div>
                        
                        {/* Template content */}
                        <div className="relative">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <div className="p-3 rounded-lg bg-slate-700/50 group-hover:bg-blue-900/30 transition-colors duration-300 shadow-inner">
                                {template.icon}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">{template.title}</h3>
                                <p className="text-sm text-slate-400 mt-1 line-clamp-2">{template.description}</p>
                              </div>
                            </div>
                            <div className="bg-blue-900/30 rounded-full p-2 text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg shadow-blue-900/20">
                              <ChevronRight size={16} />
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                              {template.tags.map(tag => (
                                <span 
                                  key={tag} 
                                  className="px-2.5 py-1 bg-slate-700/50 group-hover:bg-slate-700/80 rounded-md text-xs text-slate-300 transition-colors duration-300"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            {template.popularity === 'high' && (
                              <span className="text-xs bg-blue-900/30 text-blue-300 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                                <Star size={12} fill="currentColor" className={hoverState.id === template.id && hoverState.isHovered ? "animate-ping-small" : ""} />
                                <span>Popular</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredTemplates.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 border border-dashed border-slate-700/80 rounded-xl bg-slate-800/30 backdrop-blur-sm mt-4">
                      <div className="bg-slate-700/30 p-5 rounded-full mb-5 shadow-inner">
                        <LayoutTemplate size={36} className="text-slate-500" />
                      </div>
                      <h3 className="text-lg font-medium text-slate-300 mb-1">No templates found</h3>
                      <p className="text-slate-500 text-sm mb-6 max-w-md text-center">
                        No templates found in this category. Try another category or create a custom workflow.
                      </p>
                      <button
                        onClick={() => setTemplateCategory('all')}
                        className="px-5 py-2 bg-gradient-to-r from-blue-800/50 to-indigo-800/50 hover:from-blue-700/50 hover:to-indigo-700/50 rounded-lg text-blue-300 shadow-lg transition-all"
                      >
                        View all templates
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          /* Workflows Section */
          <div className="mt-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                  <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Your Workflows</h2>
                </div>
                <p className="text-slate-400 text-sm mt-1 ml-3">Manage and monitor your active workflow automations</p>
              </div>
              
              <div className="flex items-center mt-4 sm:mt-0 bg-slate-800/80 backdrop-blur-sm rounded-lg p-1 border border-slate-700/80">
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
            
            {/* Template Suggestions - Now on Home Page */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">{isLoading ? "Templates for You" : workflows.length === 0 ? "Get Started with Templates" : "Templates for You"}</h3>
                </div>
                <button
                  onClick={() => setShowTemplates(true)}
                  className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-all group"
                >
                  <span>View all templates</span>
                  <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
              
              {!isLoading && workflows.length === 0 && (
                <div className="bg-gradient-to-br from-blue-900/10 to-indigo-900/10 p-4 rounded-lg border border-blue-500/20 mb-6">
                  <p className="text-sm text-blue-300">
                    Start automating your social media presence by using one of our pre-built templates below!
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {isLoading ? (
                  // Template suggestion skeleton loaders
                  Array(3).fill(0).map((_, i) => (
                    <div 
                      key={i} 
                      className="bg-slate-800/80 border border-slate-700/50 rounded-xl p-5 animate-pulse"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-slate-700/70 rounded-lg"></div>
                        <div className="h-5 bg-slate-700/70 rounded w-1/2"></div>
                        <div className="h-4 w-16 bg-slate-700/50 rounded-full ml-auto"></div>
                      </div>
                      <div className="h-4 bg-slate-700/60 rounded w-full mb-2"></div>
                      <div className="h-4 bg-slate-700/50 rounded w-3/4 mb-4"></div>
                      <div className="flex gap-2 mb-4">
                        <div className="h-3 bg-slate-700/40 rounded w-12"></div>
                        <div className="h-3 bg-slate-700/40 rounded w-16"></div>
                      </div>
                      <div className="h-8 bg-slate-700/60 rounded-lg w-full mt-4"></div>
                    </div>
                  ))
                ) : (
                  getSuggestedTemplates().map(template => (
                    <div 
                      key={template.id}
                      className="relative bg-gradient-to-br from-slate-800 via-slate-800/90 to-slate-800/70 border border-slate-700/80 hover:border-blue-500/40 rounded-xl p-5 transition-all duration-300 cursor-pointer group transform hover:-translate-y-1 hover:shadow-xl"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-blue-500/5 to-indigo-500/10 rounded-full blur-2xl"></div>
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-indigo-500/0 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-700"></div>
                      
                      <div className="relative">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2.5 rounded-lg bg-gradient-to-br from-slate-700/80 to-slate-800/80 group-hover:from-blue-900/20 group-hover:to-indigo-900/30 transition-colors shadow-inner">
                            {template.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold text-white group-hover:text-blue-300 transition-colors">{template.title}</h4>
                          </div>
                          {template.popularity === 'high' && (
                            <span className="text-xs bg-gradient-to-r from-blue-900/40 to-indigo-900/40 text-blue-300 px-2 py-0.5 rounded-full flex items-center gap-1 ml-auto border border-blue-500/20">
                              <Star size={10} fill="currentColor" className="group-hover:animate-pulse" />
                              <span>Popular</span>
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 mb-4 line-clamp-2 min-h-[40px]">{template.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {template.tags.slice(0, 2).map(tag => (
                            <span 
                              key={tag} 
                              className="px-2 py-0.5 bg-slate-700/50 rounded-md text-xs text-slate-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <button className="w-full py-2 text-sm font-medium bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-900/20 group-hover:shadow-lg group-hover:shadow-blue-900/40">
                          <Plus size={14} />
                          <span>Use template</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {isLoading ? (
              <SkeletonLoader />
            ) : filteredWorkflows.length > 0 ? (
              <div className="space-y-5 animate-fadeIn">
                {filteredWorkflows.map((workflow, index) => (
                  <div key={workflow.id} className="animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                    <AutomationCards workflow={workflow} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 border border-dashed border-slate-700/80 rounded-xl bg-slate-800/30 backdrop-blur-sm">
                <div className="p-8 rounded-full bg-gradient-to-r from-slate-700/20 to-slate-800/20 shadow-inner mb-6 relative">
                  <div className="absolute inset-0 rounded-full bg-blue-500/5 animate-pulse"></div>
                  <Box size={40} className="text-slate-500" />
                </div>
                <h3 className="text-xl font-medium text-slate-300 mb-2">
                  {filterStatus !== 'all' 
                    ? `No ${filterStatus} workflows found` 
                    : "Ready to start automating?"}
                </h3>
                <p className="text-slate-500 text-sm mb-6 max-w-md text-center">
                  {filterStatus !== 'all' 
                    ? `Try changing your filter to see other workflows.` 
                    : "Create your first workflow or use one of our templates to automate your social media tasks."}
                </p>
                {filterStatus === 'all' && (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => {
                        setSelectedTemplate(null);
                        setShowPopup(true);
                      }}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg text-sm font-medium transition-all hover:shadow-lg hover:shadow-blue-700/20"
                    >
                      <Plus size={18} />
                      Create your first workflow
                    </button>
                    <button
                      onClick={() => setShowTemplates(true)}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-800/80 to-purple-800/80 hover:from-indigo-700/80 hover:to-purple-700/80 rounded-lg text-sm font-medium transition-all hover:shadow-lg hover:shadow-indigo-700/20"
                    >
                      <LayoutTemplate size={18} />
                      Use a template
                    </button>
                  </div>
                )}
              </div>
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
          onClose={() => {
            setShowPopup(false);
            setSelectedTemplate(null);
          }}
          onSubmit={handleWorkflowSubmit}
          isTemplate={!!selectedTemplate}
          templateName={selectedTemplate?.title}
        />
      )}
    </div>
  );
};

export default Home;