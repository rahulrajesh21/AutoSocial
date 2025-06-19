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
      case 'account-management': return 'Account Management';
      case 'reporting': return 'Reporting';
      case 'community-support': return 'Community Support';
      default: return 'Help Topic';
    }
  };

  // Helper to get icon based on category
  const getCategoryIcon = () => {
    switch(category) {
      case 'instagram-automation': return <Instagram className="text-pink-500" />;
      case 'content-scheduler': return <Calendar className="text-green-500" />;
      case 'help-desk': return <LifeBuoy className="text-emerald-500" />;
      case 'workflow-automation': return <Zap className="text-orange-500" />;
      case 'getting-started': return <BookOpen className="text-blue-500" />;
      case 'account-management': return <Settings className="text-indigo-500" />;
      case 'reporting': return <BarChart2 className="text-purple-500" />;
      case 'community-support': return <MessageCircle className="text-rose-500" />;
      default: return <HelpCircle className="text-gray-500" />;
    }
  };

  // Get category-specific content
  const getCategoryContent = () => {
    switch(category) {
      case 'getting-started':
        return (
          <>
            <HelpContent title="Introduction to AutoSocial">
              <p>
                Welcome to AutoSocial, your all-in-one platform for social media automation and management.
                This guide will help you set up your account and get familiar with the main features.
              </p>
              <p className="mt-4">
                AutoSocial helps you automate your social media presence, manage customer interactions,
                and analyze performance—all from a single, intuitive dashboard.
              </p>
            </HelpContent>
            
            <HelpContent title="Setting Up Your Account">
              <p>To get started with AutoSocial, follow these steps:</p>
              <Steps steps={[
                "Create an account using your email or sign in with Google/Facebook",
                "Verify your email address through the confirmation link",
                "Complete your profile by adding your business information",
                "Connect your social media accounts (Instagram, Twitter, etc.)"
              ]} />
            </HelpContent>
            
            <HelpContent title="Your First Steps">
              <p>After setting up your account, we recommend exploring these key areas:</p>
              <ul className="list-disc pl-5 space-y-2 mt-4">
                <li>Dashboard: Get an overview of your connected accounts</li>
                <li>Automations: Create your first workflow</li>
                <li>Content Calendar: Plan and schedule your posts</li>
                <li>Help Desk: Set up customer support automation</li>
              </ul>
              <Note type="info">
                <p>Complete the onboarding checklist to unlock additional features and earn a 7-day free trial extension!</p>
              </Note>
            </HelpContent>
          </>
        );
        
      case 'account-management':
        return (
          <>
            <HelpContent title="Managing Your Account">
              <p>
                Your AutoSocial account is the hub for all your social media management activities.
                This section covers how to manage your account settings, subscriptions, and team access.
              </p>
            </HelpContent>
            
            <HelpContent title="Connecting Social Platforms">
              <p>AutoSocial supports integration with multiple social platforms:</p>
              <Steps steps={[
                "Go to Settings > Integrations",
                "Select the social platform you want to connect",
                "Follow the authentication process for that platform",
                "Confirm permissions and access levels",
                "Verify the connection is working properly"
              ]} />
              <Note type="warning">
                <p>For Instagram connections, you must have an Instagram Business account linked to a Facebook page.</p>
              </Note>
            </HelpContent>
            
            <HelpContent title="Billing and Subscriptions">
              <p>
                Manage your subscription plan, billing history, and payment methods through the Settings menu.
                AutoSocial offers several plans to meet different needs:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4">
                <li>Free: Basic features for individuals</li>
                <li>Pro: Advanced features for small businesses</li>
                <li>Business: Complete toolkit for marketing teams</li>
                <li>Enterprise: Custom solutions for large organizations</li>
              </ul>
              <p className="mt-4">
                All plans include a 14-day free trial with no credit card required.
              </p>
            </HelpContent>
          </>
        );
        
      case 'instagram-automation':
        return (
          <>
            <HelpContent title="Instagram Automation Features">
              <p>
                AutoSocial provides powerful automation tools specifically designed for Instagram,
                helping you grow your audience and engage with followers without constant manual effort.
              </p>
              <p className="mt-4">
                Our Instagram automation tools comply with Instagram's policies and use official APIs
                to ensure your account remains in good standing.
              </p>
            </HelpContent>
            
            <HelpContent title="Automated Comment Responses">
              <p>Set up intelligent responses to comments on your Instagram posts:</p>
              <Steps steps={[
                "Go to Automations and create a new workflow",
                "Select 'Instagram' as the platform",
                "Choose 'Comment' as the trigger",
                "Set up AI-powered or custom responses based on comment content",
                "Add conditions to filter which comments to respond to",
                "Activate your workflow"
              ]} />
              <Note type="success">
                <p>Use our AI-powered responses to create natural-sounding replies that feel personal!</p>
              </Note>
            </HelpContent>
            
            <HelpContent title="Direct Message Automation">
              <p>
                Automate responses to Direct Messages on Instagram to improve customer service
                and response times, even when you're not online.
              </p>
              <p className="mt-4">
                You can create complex conversation flows with conditional logic, AI-powered
                responses, and integration with your help desk system.
              </p>
              <Note type="warning">
                <p>Make sure to follow Instagram's terms of service when setting up message automations.</p>
              </Note>
            </HelpContent>
          </>
        );
        
      case 'content-scheduler':
        return (
          <>
            <HelpContent title="Content Calendar Overview">
              <p>
                The Content Scheduler feature allows you to plan, create, and schedule your social media 
                content across multiple platforms from one central calendar view.
              </p>
            </HelpContent>
            
            <HelpContent title="Scheduling Instagram Posts">
              <p>To schedule content for Instagram:</p>
              <Steps steps={[
                "Open the Content Calendar from the main navigation",
                "Click the '+ New Post' button or select a date on the calendar",
                "Upload your media (images or videos)",
                "Write your caption and add hashtags",
                "Set the date and time for publishing",
                "Review and schedule your post"
              ]} />
              <Note type="info">
                <p>For optimal engagement, use our AI-powered recommendations for the best time to post.</p>
              </Note>
            </HelpContent>
            
            <HelpContent title="Bulk Scheduling and Content Library">
              <p>
                Save time by scheduling multiple posts at once using our bulk upload feature,
                and maintain a library of content for reuse and repurposing.
              </p>
              <p className="mt-4">
                The Content Library allows you to:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Store and organize media files by category</li>
                <li>Save caption templates for quick reuse</li>
                <li>Track which content has been published or scheduled</li>
                <li>Filter by performance metrics to identify your best content</li>
              </ul>
            </HelpContent>
          </>
        );
        
      case 'help-desk':
        return (
          <>
            <HelpContent title="Help Desk Integration">
              <p>
                AutoSocial's Help Desk tools transform your social media channels into effective
                customer support platforms by automating responses and managing support tickets.
              </p>
            </HelpContent>
            
            <HelpContent title="Setting Up Customer Support Workflows">
              <p>Create automated customer support workflows:</p>
              <Steps steps={[
                "Navigate to the Help Desk section in your dashboard",
                "Create a new support automation flow",
                "Configure trigger conditions (keywords, message types, etc.)",
                "Set up the response workflow using our visual designer",
                "Add AI-powered responses or pre-defined templates",
                "Include ticket creation steps and escalation paths",
                "Test and activate your workflow"
              ]} />
            </HelpContent>
            
            <HelpContent title="Managing Support Tickets">
              <p>
                The ticket management system allows you to track, prioritize, and resolve
                customer issues efficiently across all your connected platforms.
              </p>
              <p className="mt-4">
                Key features include:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Centralized ticket dashboard with status tracking</li>
                <li>Automated ticket creation from social media interactions</li>
                <li>Assignment and escalation workflows</li>
                <li>Performance analytics and response time tracking</li>
                <li>Customer satisfaction measurement</li>
              </ul>
              <Note type="info">
                <p>Connect your existing help desk solution (like Zendesk or Freshdesk) using our integrations.</p>
              </Note>
            </HelpContent>
          </>
        );
        
      case 'workflow-automation':
        return (
          <>
            <HelpContent title="Visual Workflow Designer">
              <p>
                Create powerful automation workflows without code using our intuitive
                drag-and-drop visual designer.
              </p>
              <p className="mt-4">
                The Workflow Designer is the heart of AutoSocial's automation capabilities,
                allowing you to build complex workflows connecting triggers, conditions, and actions.
              </p>
            </HelpContent>
            
            <HelpContent title="Creating Your First Workflow">
              <p>To create an automation workflow:</p>
              <Steps steps={[
                "Navigate to the Automations page",
                "Click 'Create New Workflow'",
                "Choose a starting trigger (e.g., 'When someone comments on my post')",
                "Add action nodes to define what happens (e.g., 'Send an AI-generated response')",
                "Connect nodes with edges to create the flow logic",
                "Add conditions to create branching paths based on specific criteria",
                "Test your workflow with the simulation tool",
                "Activate the workflow when ready"
              ]} />
              <Note type="info">
                <p>Use our pre-built templates as a starting point for common automation scenarios!</p>
              </Note>
            </HelpContent>
            
            <HelpContent title="Advanced Workflow Features">
              <p>
                Take your automations to the next level with these advanced features:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4">
                <li>Conditional branches based on message content, user data, or time</li>
                <li>AI integration for natural language processing and response generation</li>
                <li>Delay nodes for timed actions and follow-ups</li>
                <li>Data collection and form handling</li>
                <li>Integration with external services via webhooks and API connections</li>
                <li>Multi-platform workflows that span different social networks</li>
              </ul>
            </HelpContent>
          </>
        );
        
      case 'reporting':
        return (
          <>
            <HelpContent title="Analytics Dashboard">
              <p>
                AutoSocial's reporting tools provide comprehensive insights into your social media
                performance, automation effectiveness, and customer engagement metrics.
              </p>
            </HelpContent>
            
            <HelpContent title="Key Performance Metrics">
              <p>
                Our reporting dashboards track the following key metrics:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4">
                <li>Follower growth and audience demographics</li>
                <li>Engagement rates (likes, comments, shares, saves)</li>
                <li>Post performance and reach</li>
                <li>Automation efficiency and response times</li>
                <li>Help desk metrics (ticket volume, resolution time, satisfaction scores)</li>
                <li>Content calendar effectiveness</li>
              </ul>
            </HelpContent>
            
            <HelpContent title="Creating Custom Reports">
              <p>Build customized reports to focus on the metrics that matter most to you:</p>
              <Steps steps={[
                "Navigate to the Reporting section",
                "Click 'Create Custom Report'",
                "Select the data sources and platforms to include",
                "Choose the metrics and dimensions to analyze",
                "Set the date range and comparison periods",
                "Apply filters to focus on specific segments",
                "Save and schedule recurring report delivery"
              ]} />
              <Note type="success">
                <p>Reports can be exported as PDF, CSV, or shared directly with team members!</p>
              </Note>
            </HelpContent>
          </>
        );
        
      case 'community-support':
        return (
          <>
            <HelpContent title="Community Forums">
              <p>
                Connect with other AutoSocial users in our community forums to share ideas,
                ask questions, and learn from others' experiences.
              </p>
            </HelpContent>
            
            <HelpContent title="Joining the Community">
              <p>Get started with the AutoSocial community:</p>
              <Steps steps={[
                "Access the Community section from your dashboard",
                "Create your community profile",
                "Introduce yourself in the Welcome thread",
                "Browse categories that interest you",
                "Follow topics to receive notifications",
                "Participate in discussions and share your knowledge"
              ]} />
            </HelpContent>
            
            <HelpContent title="Community Resources">
              <p>
                Our community offers valuable resources to help you make the most of AutoSocial:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4">
                <li>Workflow templates shared by other users</li>
                <li>Case studies and success stories</li>
                <li>Monthly webinars and virtual meetups</li>
                <li>Early access to beta features</li>
                <li>Special interest groups for different industries</li>
              </ul>
              <Note type="info">
                <p>Join our monthly community calls to get tips directly from our product team!</p>
              </Note>
            </HelpContent>
          </>
        );
        
      default:
        return (
          <HelpContent title={`About ${getCategoryTitle()}`}>
            <p>
              This section provides detailed information about {getCategoryTitle()}.
              Select a specific topic from the sidebar to learn more.
            </p>
          </HelpContent>
        );
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
              {getCategoryContent()}
            </div>
          </div>
          
          {/* Sidebar - stacked on mobile, side-by-side on desktop */}
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
 