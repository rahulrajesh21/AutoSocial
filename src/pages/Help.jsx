import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Settings,
  BarChart2,
  MessageCircle,
  Instagram,
  Calendar,
  LifeBuoy,
  Zap,
  ChevronRight,
  Info
} from 'lucide-react';

const HelpArticle = ({ title, description, articleCount, icon: Icon, color, slug }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/help/${slug}`);
  };
  
  return (
    <div 
      className="bg-secondary border border-borderColor rounded-lg hover:border-blue-500/50 transition-colors duration-300 p-6 flex flex-col items-center text-center cursor-pointer"
      onClick={handleClick}
    >
      <div className={`${color} p-4 rounded-full mb-4`}>
        <Icon size={28} className="text-white" />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 mb-4 text-sm">{description}</p>
      <p className="text-blue-400 text-xs font-medium">{articleCount}</p>
    </div>
  );
};

// Article card component for the popular articles section
const ArticleCard = ({ title, description, slug }) => {
  const navigate = useNavigate();
  
  const handleReadMore = () => {
    navigate(`/help/article/${slug}`);
  };
  
  return (
    <div className="bg-secondary border border-borderColor rounded-lg p-5 hover:border-blue-500/50 transition-colors">
      <h3 className="text-lg font-semibold mb-3 text-white">{title}</h3>
      <p className="text-gray-400 mb-4 text-sm">
        {description}
      </p>
      <button 
        onClick={handleReadMore}
        className="text-blue-400 flex items-center text-xs font-medium"
      >
        Read more <ChevronRight size={14} className="ml-1" />
      </button>
    </div>
  );
};

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const helpCategories = [
    {
      title: 'Getting Started',
      description: 'Get your AutoSocial account set up in just a few simple steps.',
      articleCount: '8 articles',
      icon: BookOpen,
      color: 'bg-blue-600',
      slug: 'getting-started'
    },
    {
      title: 'Account Management',
      description: 'Managing your account, connecting social platforms, and billing details.',
      articleCount: '10 articles',
      icon: Settings,
      color: 'bg-indigo-600',
      slug: 'account-management'
    },
    {
      title: 'Reporting',
      description: 'Reporting features, metric definitions, and usage case scenarios.',
      articleCount: '11 articles',
      icon: BarChart2,
      color: 'bg-purple-600',
      slug: 'reporting'
    },
    {
      title: 'Instagram Automation',
      description: 'Learn how to automate your Instagram posting and engagement.',
      articleCount: '14 articles',
      icon: Instagram,
      color: 'bg-pink-600',
      slug: 'instagram-automation'
    },
    {
      title: 'Content Scheduler',
      description: 'Schedule and manage your social media content calendar.',
      articleCount: '9 articles',
      icon: Calendar,
      color: 'bg-green-600',
      slug: 'content-scheduler'
    },
    {
      title: 'Help Desk Tools',
      description: 'Setting up and managing customer support tickets and workflows.',
      articleCount: '12 articles',
      icon: LifeBuoy,
      color: 'bg-emerald-600',
      slug: 'help-desk'
    },
    {
      title: 'Workflow Automation',
      description: 'Create powerful automation workflows with our visual designer.',
      articleCount: '15 articles',
      icon: Zap,
      color: 'bg-orange-600',
      slug: 'workflow-automation'
    },
    {
      title: 'Community Support',
      description: 'Join our community forums and get help from other users.',
      articleCount: '6 articles',
      icon: MessageCircle,
      color: 'bg-rose-600',
      slug: 'community-support'
    }
  ];
  
  const popularArticles = [
    {
      title: "How to Schedule Instagram Posts",
      description: "Learn how to use our scheduler to automate your Instagram content publishing and maximize engagement.",
      slug: "schedule-instagram-posts"
    },
    {
      title: "Creating Your First Automation Workflow",
      description: "A step-by-step guide to creating powerful social media automation workflows using our visual designer.",
      slug: "create-automation-workflow"
    },
    {
      title: "Connecting Instagram Business Account",
      description: "How to connect and authorize your Instagram Business account with AutoSocial for full automation capabilities.",
      slug: "connect-instagram-account"
    },
    {
      title: "Managing Help Desk Tickets",
      description: "Learn how to efficiently manage customer support tickets using our integrated help desk system.",
      slug: "manage-help-desk-tickets"
    }
  ];
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // In a real application, this would search through documentation
    navigate(`/help/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="min-h-screen bg-primary text-white">
      {/* Header */}
      <div className="border-b border-borderColor bg-secondary">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold">Help Center</h1>
              <p className="text-sm text-gray-400">Find answers and learn how to use AutoSocial</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Search Section */}
      <div className="relative bg-secondary/30 border-b border-borderColor py-16 px-4 overflow-hidden bg-gradient-to-b from-secondary/30 via-secondary/40 to-secondary/30">
        <div className="absolute inset-0 overflow-hidden opacity-30 backdrop-blur-[80px]">
          {/* Decorative elements - network connections */}
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Horizontal curved lines */}
            <path d="M10,20 Q50,5 90,20" stroke="url(#line-gradient)" strokeWidth="0.8" fill="none" />
            <path d="M10,50 Q50,35 90,50" stroke="url(#line-gradient)" strokeWidth="0.8" fill="none" />
            <path d="M10,80 Q50,65 90,80" stroke="url(#line-gradient)" strokeWidth="0.8" fill="none" />
            
            {/* Vertical connecting lines */}
            <path d="M30,10 L30,90" stroke="url(#line-gradient-vertical)" strokeWidth="0.6" strokeDasharray="2,2" fill="none" opacity="0.7" />
            <path d="M70,10 L70,90" stroke="url(#line-gradient-vertical)" strokeWidth="0.6" strokeDasharray="2,2" fill="none" opacity="0.7" />
            
            <defs>
              <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
              <linearGradient id="line-gradient-vertical" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">How can we help?</h1>
          
          {/* Search bar - centered with max-width */}
          <form onSubmit={handleSearch} className="flex w-full max-w-xl mx-auto">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search AutoSocial docs, guides, tutorials..."
                className="w-full px-4 py-3 bg-foreground border border-borderColor rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-r-md flex items-center justify-center transition-colors"
            >
              <Search size={18} className="mr-2" /> Search
            </button>
          </form>
        </div>
      </div>
      
      {/* Quick Help Section - Featured topics */}
      <div className="bg-primary border-b border-borderColor">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-8 overflow-x-auto scrollbar-hide">
            <a href="#instagram" className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors whitespace-nowrap">
              <Instagram size={18} />
              <span>Instagram</span>
            </a>
            <a href="#automation" className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors whitespace-nowrap">
              <Zap size={18} />
              <span>Automation</span>
            </a>
            <a href="#scheduler" className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors whitespace-nowrap">
              <Calendar size={18} />
              <span>Scheduler</span>
            </a>
            <a href="#helpdesk" className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors whitespace-nowrap">
              <LifeBuoy size={18} />
              <span>Help Desk</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Help categories grid */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <Info size={18} className="mr-2 text-blue-400" />
          Documentation Categories
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {helpCategories.map((category, index) => (
            <HelpArticle key={index} {...category} />
          ))}
        </div>
      </div>
      
      {/* Popular articles section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <BookOpen size={18} className="mr-2 text-blue-400" />
          Popular Articles
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {popularArticles.map((article, index) => (
            <ArticleCard key={index} {...article} />
          ))}
        </div>
      </div>
      
      {/* Contact support */}
      <div className="container mx-auto px-4 py-12 mb-8">
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h3 className="text-xl font-semibold text-white mb-2">Need more help?</h3>
            <p className="text-gray-400 max-w-xl">
              Our support team is available to assist you with any questions or issues you might have.
            </p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default Help; 