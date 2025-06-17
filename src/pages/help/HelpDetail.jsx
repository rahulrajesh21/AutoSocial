import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Settings,
  BarChart2,
  MessageCircle,
  Instagram,
  Calendar,
  LifeBuoy,
  Zap,
  Info,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileText
} from 'lucide-react';

// HelpContent component for individual sections
const HelpContent = ({ title, children }) => {
  return (
    <div className="mb-8 pb-6 border-b border-borderColor last:border-b-0 last:pb-0">
      <h2 className="text-xl font-semibold mb-4 text-white">{title}</h2>
      <div className="text-gray-300 space-y-4">
        {children}
      </div>
    </div>
  );
};

// Step-by-step instructions component
const Steps = ({ steps }) => {
  return (
    <ol className="space-y-4 mt-4">
      {steps.map((step, index) => (
        <li key={index} className="flex">
          <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 flex-shrink-0 mt-0.5">
            {index + 1}
          </span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );
};

// Note component for tips and important information
const Note = ({ type = "info", children }) => {
  const icons = {
    info: <Info size={20} className="text-blue-400" />,
    success: <CheckCircle2 size={20} className="text-green-400" />,
    warning: <AlertCircle size={20} className="text-yellow-400" />,
    error: <AlertCircle size={20} className="text-red-400" />
  };
  
  const backgrounds = {
    info: "bg-blue-900/20 border-blue-500/30",
    success: "bg-green-900/20 border-green-500/30",
    warning: "bg-yellow-900/20 border-yellow-500/30",
    error: "bg-red-900/20 border-red-500/30"
  };
  
  return (
    <div className={`${backgrounds[type]} border rounded-lg p-4 my-6`}>
      <div className="flex gap-3">
        {icons[type]}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

const HelpDetail = () => {
  const { category } = useParams();
  const [loading, setLoading] = useState(true);
  
  // Simulating loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Helper to get title based on category
  const getCategoryTitle = () => {
    switch(category) {
      case 'instagram-automation': return 'Instagram Automation';
      case 'content-scheduler': return 'Content Scheduler';
      case 'help-desk': return 'Help Desk Tools';
      case 'workflow-automation': return 'Workflow Automation';
      case 'getting-started': return 'Getting Started';
      default: return 'Help Topic';
    }
  };

  // Helper to get icon based on category
  const getCategoryIcon = () => {
    switch(category) {
      case 'instagram-automation': return <Instagram className="text-pink-500" />;
      case 'content-scheduler': return <Calendar className="text-green-500" />;
      case 'help-desk': return <LifeBuoy className="text-emerald-500" />;
      case 'getting-started': return <BookOpen className="text-blue-500" />;
      default: return <Settings className="text-indigo-500" />;
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-primary text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-primary text-white">
      {/* Header */}
      <div className="border-b border-borderColor bg-secondary">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <Link to="/help" className="flex items-center text-sm text-gray-400 hover:text-blue-400 transition-colors">
              <ArrowLeft size={16} className="mr-1" /> Back to Help Center
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Topic Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-borderColor">
          <div className="bg-secondary p-4 rounded-full">
            {getCategoryIcon()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{getCategoryTitle()}</h1>
            <p className="text-gray-400">Detailed information about {getCategoryTitle()}</p>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-secondary p-6 rounded-lg border border-borderColor">
              {/* Content would go here - this is simplified for now */}
              <h2 className="text-xl font-semibold mb-4">Introduction to {getCategoryTitle()}</h2>
              <p className="text-gray-300 mb-6">
                This section provides detailed documentation about {getCategoryTitle()}.
                You'll learn how to use this feature effectively to improve your social media management.
              </p>
              
              <h2 className="text-xl font-semibold mb-4">Key Features</h2>
              <p className="text-gray-300 mb-6">
                The {getCategoryTitle()} module offers several powerful features to help you automate and streamline your workflows.
              </p>
              
              <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
              <p className="text-gray-300">
                To get started with {getCategoryTitle()}, follow the steps outlined in this documentation.
              </p>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-secondary border border-borderColor rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-4">Related Articles</h3>
              
              <div className="space-y-3">
                <Link 
                  to={`/help/article/${category}-guide`}
                  className="block p-3 rounded-lg hover:bg-foreground transition-colors text-gray-300 hover:text-white"
                >
                  Complete Guide to {getCategoryTitle()}
                </Link>
                <Link 
                  to={`/help/article/${category}-tips`}
                  className="block p-3 rounded-lg hover:bg-foreground transition-colors text-gray-300 hover:text-white"
                >
                  Tips and Best Practices
                </Link>
                <Link 
                  to={`/help/article/${category}-troubleshooting`}
                  className="block p-3 rounded-lg hover:bg-foreground transition-colors text-gray-300 hover:text-white"
                >
                  Troubleshooting Common Issues
                </Link>
              </div>
            </div>
            
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-5 mt-6">
              <h3 className="text-lg font-semibold mb-2">Need help?</h3>
              <p className="text-gray-400 text-sm mb-4">
                Still have questions about this topic?
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white w-full font-medium px-4 py-2 rounded-md transition-colors text-sm">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpDetail;
 