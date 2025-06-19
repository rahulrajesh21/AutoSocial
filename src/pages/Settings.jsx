import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Settings as SettingsIcon, Instagram, RefreshCw, Save, Lock, Globe } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
    <div className="p-6 text-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 mb-1 flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-rose-600/20">
              <SettingsIcon size={20} className="text-rose-400" />
            </div>
            Settings
          </h1>
          <p className="text-sm text-gray-400">
            Configure application settings and integrations
          </p>
        </div>
      </div>
      
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700/50 shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700/50">
          <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg">
            <Instagram size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-white">Instagram Integration</h2>
            <p className="text-sm text-gray-400">Configure your Instagram API credentials</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="instagram_access_token" className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Lock size={14} className="text-gray-400" />
                Access Token
              </label>
              <input
                type="text"
                id="instagram_access_token"
                name="instagram_access_token"
                value={apiKeys.instagram_access_token}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700/60 border border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors text-gray-200"
                placeholder="Enter your Instagram access token"
              />
              <p className="mt-1.5 text-xs text-gray-400">
                Long-lived token for Instagram Graph API access
              </p>
            </div>
            
            <div>
              <label htmlFor="instagram_page_token" className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Globe size={14} className="text-gray-400" />
                Page Token
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="instagram_page_token"
                  name="instagram_page_token"
                  value={apiKeys.instagram_page_token}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700/60 border border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors text-gray-200"
                  placeholder="Enter page token"
                />
                <button
                  type="button"
                  onClick={handleExchangeToken}
                  disabled={exchangeLoading || !apiKeys.instagram_page_token}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {exchangeLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Converting...
                    </>
                  ) : (
                    <>
                      <RefreshCw size={16} />
                      Convert to Long-lived
                    </>
                  )}
                </button>
              </div>
              <p className="mt-1.5 text-xs text-gray-400">
                Short-lived tokens expire quickly. Click "Convert to Long-lived" to get a token valid for 60 days.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end items-center pt-4 mt-6 border-t border-gray-700/50">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;