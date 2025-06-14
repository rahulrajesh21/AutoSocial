import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const Settings = () => {
  const [apiKeys, setApiKeys] = useState({
    instagram_access_token: '',
    instagram_page_token: '',
    instagram_api_key: ''
  });
  const [loading, setLoading] = useState(false);

  // Load saved keys on component mount
  useEffect(() => {
    const savedKeys = localStorage.getItem('social_api_keys');
    if (savedKeys) {
      setApiKeys(JSON.parse(savedKeys));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApiKeys(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Save to localStorage
    localStorage.setItem('social_api_keys', JSON.stringify(apiKeys));
    
    // Here you would typically also save to your backend
    // For example: axios.post('/api/settings/update', apiKeys)
    
    setTimeout(() => {
      setLoading(false);
      toast.success('Settings saved successfully');
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-light mb-8 text-gray-800 dark:text-gray-100">Settings</h1>
      
      <div className="space-y-8">
        <section className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h2 className="text-xl font-light mb-6 text-gray-700 dark:text-gray-200">Instagram API Configuration</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="col-span-2">
                <label htmlFor="instagram_access_token" className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Access Token
                </label>
                <input
                  type="text"
                  id="instagram_access_token"
                  name="instagram_access_token"
                  value={apiKeys.instagram_access_token}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition-all duration-200"
                  placeholder="Enter your Instagram access token"
                />
                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                  Long-lived token for Instagram Graph API
                </p>
              </div>
              
              <div>
                <label htmlFor="instagram_page_token" className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Page Token
                </label>
                <input
                  type="text"
                  id="instagram_page_token"
                  name="instagram_page_token"
                  value={apiKeys.instagram_page_token}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition-all duration-200"
                  placeholder="Enter page token"
                />
              </div>
              
              <div>
                <label htmlFor="instagram_api_key" className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
                  API Key
                </label>
                <input
                  type="text"
                  id="instagram_api_key"
                  name="instagram_api_key"
                  value={apiKeys.instagram_api_key}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition-all duration-200"
                  placeholder="Enter API key"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving
                  </>
                ) : 'Save Settings'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Settings; 