import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, ThumbsUp, ThumbsDown, Share2 } from 'lucide-react';

const HelpArticle = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  
  // Simulating loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Helper to get title based on slug
  const getArticleTitle = () => {
    switch(slug) {
      case 'schedule-instagram-posts':
        return 'How to Schedule Instagram Posts';
      case 'connect-instagram-account':
        return 'Connecting Instagram Business Account';
      case 'create-automation-workflow':
        return 'Creating Your First Automation Workflow';
      case 'manage-help-desk-tickets':
        return 'Managing Help Desk Tickets';
      default:
        return 'Help Article';
    }
  };

  // Helper to get content based on slug
  const getArticleContent = () => {
    switch(slug) {
      case 'schedule-instagram-posts':
        return (
          <div className="space-y-6">
            <p>
              Learn how to use our scheduler to automate your Instagram content publishing and 
              maximize engagement with your audience.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Step-by-step guide to scheduling Instagram posts</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">1. Navigate to the Automations tab</h3>
                <p className="text-gray-300">
                  Start by clicking on the Automations tab in the left sidebar of your AutoSocial dashboard.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">2. Upload your media</h3>
                <p className="text-gray-300">
                  Click on the "Media Upload" area and select the image or video you wish to post.
                  You can also drag and drop media files directly into this area.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">3. Create your caption</h3>
                <p className="text-gray-300">
                  Write an engaging caption for your post. You can include hashtags, emojis,
                  and mentions. Our AI assistant can help you generate caption ideas based on your content.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">4. Select publishing time</h3>
                <p className="text-gray-300">
                  Choose when you want your post to be published. You can select a specific date and time,
                  or use our "Optimal Time" feature to automatically post when your audience is most active.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">5. Add to queue</h3>
                <p className="text-gray-300">
                  Click "Schedule Post" to add it to your queue. Your post will be automatically
                  published at the scheduled time without any further action required.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">6. Monitor your scheduled posts</h3>
                <p className="text-gray-300">
                  You can view and manage all your scheduled posts in the calendar view. From there,
                  you can edit, reschedule, or delete scheduled posts as needed.
                </p>
              </div>
            </div>
            
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 my-8">
              <h3 className="flex items-center text-lg font-medium mb-2">
                <FileText className="mr-2 text-blue-400" size={18} />
                Pro Tip
              </h3>
              <p>
                Use the bulk scheduling feature to prepare content for an entire week or month at once,
                saving you valuable time and ensuring consistent posting.
              </p>
            </div>
          </div>
        );

      case 'connect-instagram-account':
        return (
          <div className="space-y-6">
            <p>
              This guide will walk you through the process of connecting your Instagram Business account
              to AutoSocial to unlock full automation capabilities.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Requirements before you begin</h2>
            <p className="text-gray-300 mb-4">
              Before connecting your Instagram account, ensure you have:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>An Instagram Business account (not a personal account)</li>
              <li>Admin access to the Facebook Page connected to your Instagram Business account</li>
              <li>Admin access to the Facebook Business Manager that owns your Facebook Page</li>
            </ul>
            
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 my-6">
              <h3 className="flex items-center text-lg font-medium mb-2">
                <FileText className="mr-2 text-yellow-400" size={18} />
                Important Note
              </h3>
              <p>
                Instagram requires Business accounts for API access. If you have a personal account,
                you'll need to convert it to a Business account first through the Instagram app.
              </p>
            </div>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Connection Instructions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">1. Go to Settings {'>'} Integrations</h3>
                <p className="text-gray-300">
                  In your AutoSocial dashboard, navigate to the Settings page and select the Integrations tab.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">2. Select Instagram</h3>
                <p className="text-gray-300">
                  Find and click on the Instagram integration card to begin the connection process.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">3. Authorize with Facebook</h3>
                <p className="text-gray-300">
                  Click "Connect with Facebook" and login to your Facebook account if prompted.
                  You'll need to authorize AutoSocial to access your Facebook Pages and Instagram accounts.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">4. Select your Facebook Page</h3>
                <p className="text-gray-300">
                  Choose the Facebook Page that's connected to the Instagram Business account you want to use.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">5. Select your Instagram account</h3>
                <p className="text-gray-300">
                  Select the Instagram Business account you want to connect to AutoSocial.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">6. Grant permissions</h3>
                <p className="text-gray-300">
                  Review and approve the permissions that AutoSocial needs to manage your Instagram account.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">7. Verify connection</h3>
                <p className="text-gray-300">
                  Wait for the connection process to complete and verify that your Instagram 
                  account appears under "Connected Accounts" with a green status indicator.
                </p>
              </div>
            </div>
            
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 my-8">
              <h3 className="flex items-center text-lg font-medium mb-2">
                <FileText className="mr-2 text-blue-400" size={18} />
                Troubleshooting
              </h3>
              <p>
                If you encounter any issues during the connection process, ensure that you have admin 
                access to both your Facebook Page and Business Manager, and that your Instagram account
                is properly linked to your Facebook Page.
              </p>
            </div>
          </div>
        );
        
      case 'create-automation-workflow':
        return (
          <div className="space-y-6">
            <p>
              This step-by-step guide will show you how to create powerful social media automation workflows
              using our visual designer, allowing you to automate responses and actions on Instagram.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Creating Your First Automation Workflow</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">1. Access the Automations page</h3>
                <p className="text-gray-300">
                  Navigate to the "Automations" section from the main dashboard sidebar.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">2. Create a new workflow</h3>
                <p className="text-gray-300">
                  Click the "Create New Workflow" button in the top-right corner of the page.
                  Enter a name and description for your workflow to help you identify it later.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">3. Select a trigger</h3>
                <p className="text-gray-300">
                  Every automation starts with a trigger. Drag a trigger node from the left panel
                  onto the canvas. Available triggers include:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2 text-gray-300">
                  <li>When someone comments on a post</li>
                  <li>When someone sends a direct message</li>
                  <li>When a specific keyword is mentioned</li>
                  <li>When you publish a new post</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">4. Configure the trigger</h3>
                <p className="text-gray-300">
                  Click on the trigger node to configure its settings. For example, if you chose 
                  "When someone comments on a post," select which posts to monitor for comments.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">5. Add action nodes</h3>
                <p className="text-gray-300">
                  Drag action nodes onto the canvas and connect them to your trigger. Actions include:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2 text-gray-300">
                  <li>Send a reply or direct message</li>
                  <li>Generate an AI response</li>
                  <li>Create a help desk ticket</li>
                  <li>Add user to a segment</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">6. Connect nodes with edges</h3>
                <p className="text-gray-300">
                  Click and drag from the output port of one node to the input port of another 
                  to create connections between them. This defines the flow of your automation.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">7. Add conditional branches</h3>
                <p className="text-gray-300">
                  Use conditional nodes to create different paths based on specific criteria,
                  such as message content, user attributes, or time of day.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">8. Test your workflow</h3>
                <p className="text-gray-300">
                  Use the "Test" button to simulate different triggers and see how your workflow responds.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">9. Activate your workflow</h3>
                <p className="text-gray-300">
                  Once you're satisfied with your automation, toggle the "Active" switch to enable it.
                  Your workflow will now automatically run whenever the trigger conditions are met.
                </p>
              </div>
            </div>
            
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 my-8">
              <h3 className="flex items-center text-lg font-medium mb-2">
                <FileText className="mr-2 text-green-400" size={18} />
                Pro Tip
              </h3>
              <p>
                Start with our pre-built templates to save time. You can find them in the template library
                when creating a new automation. These templates cover common scenarios like comment management,
                FAQ responses, and customer support flows.
              </p>
            </div>
          </div>
        );

      case 'manage-help-desk-tickets':
        return (
          <div className="space-y-6">
            <p>
              Learn how to efficiently manage customer support tickets using our integrated help desk system.
              This guide covers everything from ticket creation to resolution.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Help Desk System Overview</h2>
            <p className="text-gray-300 mb-4">
              The AutoSocial Help Desk system allows you to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Automatically convert social media messages into support tickets</li>
              <li>Track customer inquiries across multiple channels</li>
              <li>Assign tickets to team members</li>
              <li>Set priority levels and due dates</li>
              <li>Measure response times and satisfaction rates</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Accessing the Help Desk</h2>
            <p className="text-gray-300">
              Navigate to the Help Desk section from the main dashboard sidebar to access the ticket management system.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Managing Support Tickets</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">1. Viewing and organizing tickets</h3>
                <p className="text-gray-300">
                  The main Help Desk dashboard displays all your tickets. Use filters to sort by:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2 text-gray-300">
                  <li>Status (Open, In Progress, Resolved)</li>
                  <li>Priority (Low, Medium, High, Urgent)</li>
                  <li>Assigned team member</li>
                  <li>Source channel (Instagram, Email, Website)</li>
                  <li>Custom tags</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">2. Creating tickets manually</h3>
                <p className="text-gray-300">
                  While most tickets will be created automatically from social interactions, you can 
                  also create tickets manually:
                </p>
                <ol className="list-decimal pl-6 space-y-2 mt-2 text-gray-300">
                  <li>Click "New Ticket" in the top-right corner</li>
                  <li>Enter the customer's information</li>
                  <li>Select the issue category</li>
                  <li>Add a description of the issue</li>
                  <li>Set priority level and assign to a team member</li>
                  <li>Click "Create Ticket"</li>
                </ol>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">3. Responding to tickets</h3>
                <p className="text-gray-300">
                  Click on any ticket to view its details and respond:
                </p>
                <ol className="list-decimal pl-6 space-y-2 mt-2 text-gray-300">
                  <li>Type your response in the reply field</li>
                  <li>Use the formatting tools to style your message</li>
                  <li>Add attachments if needed</li>
                  <li>Use templates for common responses (click the template icon)</li>
                  <li>Click "Send" to deliver your response</li>
                </ol>
                <p className="text-gray-300 mt-2">
                  Your response will be sent through the same channel the customer used to contact you.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">4. Changing ticket status</h3>
                <p className="text-gray-300">
                  Update the ticket status as you work through the resolution process:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2 text-gray-300">
                  <li><strong>Open</strong>: Newly created tickets awaiting a first response</li>
                  <li><strong>In Progress</strong>: Tickets being actively worked on</li>
                  <li><strong>Pending</strong>: Awaiting customer reply</li>
                  <li><strong>Resolved</strong>: Issue has been resolved</li>
                  <li><strong>Closed</strong>: Ticket is closed and archived</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">5. Using ticket automations</h3>
                <p className="text-gray-300">
                  Set up automated workflows for ticket handling:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2 text-gray-300">
                  <li>Auto-assignment based on issue type</li>
                  <li>Automatic prioritization using AI analysis</li>
                  <li>Follow-up reminders for pending tickets</li>
                  <li>Satisfaction surveys after ticket resolution</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 my-8">
              <h3 className="flex items-center text-lg font-medium mb-2">
                <FileText className="mr-2 text-blue-400" size={18} />
                Best Practice
              </h3>
              <p>
                Use tags to categorize common issues. This helps identify recurring problems and
                build a knowledge base of solutions that your team can reference.
              </p>
            </div>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">Measuring Help Desk Performance</h2>
            <p className="text-gray-300">
              The Analytics dashboard provides key metrics to evaluate your support performance:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-gray-300">
              <li><strong>Average response time</strong>: How quickly you're responding to tickets</li>
              <li><strong>Average resolution time</strong>: How long it takes to resolve issues</li>
              <li><strong>Customer satisfaction score</strong>: Based on post-resolution surveys</li>
              <li><strong>Ticket volume by category</strong>: Identifying common issues</li>
              <li><strong>Agent performance</strong>: Individual team member metrics</li>
            </ul>
          </div>
        );
      
      default:
        return (
          <p>Detailed content for this article coming soon.</p>
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
        {/* Article Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {/* Article Header */}
            <h1 className="text-2xl font-bold mb-2">{getArticleTitle()}</h1>
            <div className="flex items-center text-sm text-gray-400 mb-8 pb-6 border-b border-borderColor">
              <span>Last updated: Apr 12, 2024</span>
              <span className="mx-2">•</span>
              <span>5 min read</span>
            </div>
            
            {/* Article Content */}
            <div className="prose prose-invert max-w-none">
              {getArticleContent()}
            </div>
            
            {/* Article Footer */}
            <div className="mt-12 pt-6 border-t border-borderColor">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-2">Was this article helpful?</p>
                  <div className="flex space-x-2">
                    <button className="p-2 rounded-lg hover:bg-foreground transition-colors">
                      <ThumbsUp size={18} className="text-gray-400 hover:text-blue-400" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-foreground transition-colors">
                      <ThumbsDown size={18} className="text-gray-400 hover:text-blue-400" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-2">Share this article</p>
                  <button className="bg-secondary hover:bg-foreground text-white py-2 px-4 rounded-md flex items-center transition-colors">
                    <Share2 size={16} className="mr-2" /> Share
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar - displayed at the bottom on mobile, to the side on desktop */}
          <div className="lg:col-span-1">
            <div className="bg-secondary border border-borderColor rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-4">Related Articles</h3>
              
              <div className="space-y-3">
                <Link 
                  to="/help/article/connect-instagram-account"
                  className="block p-3 rounded-lg hover:bg-foreground transition-colors text-gray-300 hover:text-white"
                >
                  Connecting Instagram Account
                </Link>
                <Link 
                  to="/help/article/bulk-scheduling"
                  className="block p-3 rounded-lg hover:bg-foreground transition-colors text-gray-300 hover:text-white"
                >
                  Bulk Scheduling Posts
                </Link>
                <Link 
                  to="/help/article/post-timing"
                  className="block p-3 rounded-lg hover:bg-foreground transition-colors text-gray-300 hover:text-white"
                >
                  Optimizing Post Timing
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

export default HelpArticle;
