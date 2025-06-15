import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, FileText } from 'lucide-react';

const HelpSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Parse search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    setSearchQuery(query);
    
    // Simulate search results based on the query
    const timer = setTimeout(() => {
      if (query) {
        // Mock search results
        const results = getMockedSearchResults(query);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
      setLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, [location.search]);
  
  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/help/search?q=${encodeURIComponent(searchQuery)}`);
  };
  
  // Mock function to generate search results based on query
  const getMockedSearchResults = (query) => {
    const lowercaseQuery = query.toLowerCase();
    
    const allPossibleResults = [
      {
        title: 'How to Schedule Instagram Posts',
        description: 'Learn how to use our scheduler to automate your Instagram content publishing and maximize engagement.',
        category: 'Instagram Automation',
        url: '/help/article/schedule-instagram-posts'
      },
      {
        title: 'Connecting Instagram Business Account',
        description: 'How to connect and authorize your Instagram Business account with AutoSocial for full automation capabilities.',
        category: 'Instagram Automation',
        url: '/help/article/connect-instagram-account'
      },
      {
        title: 'Creating Your First Automation Workflow',
        description: 'A step-by-step guide to creating powerful social media automation workflows using our visual designer.',
        category: 'Workflow Automation',
        url: '/help/article/create-automation-workflow'
      },
      {
        title: 'Managing Help Desk Tickets',
        description: 'Learn how to efficiently manage customer support tickets using our integrated help desk system.',
        category: 'Help Desk Tools',
        url: '/help/article/manage-help-desk-tickets'
      },
      {
        title: 'Content Calendar Setup',
        description: 'How to set up and manage your content calendar for optimal posting schedules.',
        category: 'Content Scheduler',
        url: '/help/article/content-calendar'
      },
      {
        title: 'Bulk Scheduling Posts',
        description: 'Learn how to schedule multiple posts at once to save time.',
        category: 'Content Scheduler',
        url: '/help/article/bulk-scheduling'
      }
    ];
    
    // Filter results based on query
    return allPossibleResults.filter(result => 
      result.title.toLowerCase().includes(lowercaseQuery) || 
      result.description.toLowerCase().includes(lowercaseQuery) ||
      result.category.toLowerCase().includes(lowercaseQuery)
    );
  };
  
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
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-6">Search Results</h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
            <div className="flex">
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
            </div>
          </form>
        </div>
        
        {/* Search Results */}
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Results Summary */}
              <div className="mb-6">
                <p className="text-gray-400">
                  {searchResults.length > 0 
                    ? `Found ${searchResults.length} result${searchResults.length === 1 ? '' : 's'} for "${searchQuery}"`
                    : `No results found for "${searchQuery}"`
                  }
                </p>
              </div>
              
              {/* Results List */}
              {searchResults.length > 0 ? (
                <div className="grid gap-4">
                  {searchResults.map((result, index) => (
                    <Link 
                      to={result.url} 
                      key={index}
                      className="block bg-secondary border border-borderColor hover:border-blue-500/50 rounded-lg p-5 transition-colors"
                    >
                      <div className="flex items-start">
                        <FileText size={20} className="text-blue-400 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="text-lg font-semibold mb-1">{result.title}</h3>
                          <p className="text-gray-400 text-sm mb-2">{result.description}</p>
                          <span className="bg-foreground text-sm px-2 py-1 rounded-md text-gray-300">
                            {result.category}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-secondary border border-borderColor rounded-lg">
                  <p className="text-xl mb-2">No results found</p>
                  <p className="text-gray-400 max-w-md mx-auto mb-6">
                    We couldn't find any articles matching your search. Try using different keywords or
                    browse our help categories.
                  </p>
                  <Link 
                    to="/help"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md inline-flex items-center transition-colors"
                  >
                    Browse Help Categories
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpSearch;
