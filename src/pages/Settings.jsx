import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const Settings = () => {
  const [apiKeys, setApiKeys] = useState({
    instagram_access_token: '',
    instagram_page_token: '',
    instagram_api_key: ''
  });
  const [loading, setLoading] = useState(false);
  const [exchangeLoading, setExchangeLoading] = useState(false);

  // Load settings from API on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/instagram/settings`, {
        withCredentials: true
      });
      
      if (response.data) {
        setApiKeys({
          instagram_access_token: response.data.access_token || '',
          instagram_page_token: response.data.page_access_token || '',
          instagram_api_key: '' // Not stored in backend
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApiKeys(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExchangeToken = async () => {
    if (!apiKeys.instagram_page_token) {
      toast.error('Please enter a page token first');
      return;
    }

    setExchangeLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/instagram/exchange-token`, {
        shortLivedToken: apiKeys.instagram_page_token
      }, {
        withCredentials: true
      });

      if (response.data && response.data.access_token) {
        // Update the state with the long-lived token
        setApiKeys(prev => ({
          ...prev,
          instagram_page_token: response.data.access_token
        }));
        toast.success('Token exchanged for a long-lived token successfully');
      }
    } catch (error) {
      console.error('Error exchanging token:', error);
      toast.error(error.response?.data?.error || 'Failed to exchange token');
    } finally {
      setExchangeLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Save to backend
      await axios.post(`${API_BASE_URL}/api/instagram/settings`, {
        instagram_access_token: apiKeys.instagram_access_token,
        instagram_page_token: apiKeys.instagram_page_token,
        instagram_api_key: apiKeys.instagram_api_key
      }, {
        withCredentials: true
      });
      
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 text-white">
      <h1 className="text-3xl font-light mb-8 text-gray-800 dark:text-gray-100">Settings</h1>
      
      <div className="space-y-8 border-2 border-borderColor rounded-xl p-8">
        <section className=" border-gray-200 pb-6">
          <h2 className="text-xl font-light mb-6 text-gray-700 dark:text-gray-200">Instagram API Configuration</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="instagram_access_token" className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Access Token
                </label>
                <input
                  type="text"
                  id="instagram_access_token"
                  name="instagram_access_token"
                  value={apiKeys.instagram_access_token}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-primary border-2 border-borderColor rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition-all duration-200"
                  placeholder="Enter your Instagram access token"
                />
                {/* <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                  Long-lived token for Instagram Graph API
                </p> */}
              </div>
              
              <div>
                <label htmlFor="instagram_page_token" className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Page Token
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="instagram_page_token"
                    name="instagram_page_token"
                    value={apiKeys.instagram_page_token}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-primary border-2 border-borderColor rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition-all duration-200"
                    placeholder="Enter page token"
                  />
                  <button
                    type="button"
                    onClick={handleExchangeToken}
                    disabled={exchangeLoading || !apiKeys.instagram_page_token}
                    className="px-4 py-2.5 bg-white text-black text-sm font-medium rounded-lg transition-colors duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {exchangeLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Converting...
                      </>
                    ) : 'Convert to Long-lived'}
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                  Short-lived tokens expire quickly. Click "Convert to Long-lived" to get a token valid for 60 days.
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-6 mt-6 ">
              <p className="text-sm text-gray-500 dark:text-gray-400">Used when interacting with the Instagram API.</p>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-white hover:bg-white/50 text-black text-sm font-medium rounded-lg transition-colors duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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