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
          
          {/* Sidebar */}
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
