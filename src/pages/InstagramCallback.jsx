import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { exchangeCodeForToken, getLongLivedToken } from '../utils/instagram';
import { useAuth } from '@clerk/clerk-react';

// Add base URL constant
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://auto-social-backend.vercel.app';

const InstagramCallback = () => {
  const [status, setStatus] = useState('Processing...');
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract the authorization code from the URL
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const errorMsg = params.get('error');
        
        if (errorMsg) {
          setError(`Instagram authorization error: ${errorMsg}`);
          return;
        }
        
        if (!code) {
          setError('No authorization code found in the URL');
          return;
        }

        await processInstagramCode(code);
      } catch (err) {
        console.error('Instagram authentication error:', err);
        setError(err.message || 'Authentication failed');
      }
    };

    // Listen for the message from the popup window
    const handleAuthCodeMessage = async (event) => {
      if (event.data && event.data.type === 'INSTAGRAM_AUTH_CODE') {
        try {
          await processInstagramCode(event.data.code);
        } catch (err) {
          console.error('Instagram authentication error:', err);
          setError(err.message || 'Authentication failed');
        }
      }
    };

    window.addEventListener('message', handleAuthCodeMessage);
    
    // If we're on the callback page directly, process the code from URL
    if (location.search) {
      handleCallback();
    }

    return () => {
      window.removeEventListener('message', handleAuthCodeMessage);
    };
  }, [location, navigate, getToken]);

  const processInstagramCode = async (code) => {
    setStatus('Exchanging code for access token...');
    
    // Exchange the code for an access token
    const tokenResponse = await exchangeCodeForToken(code);
    
    if (!tokenResponse.access_token) {
      throw new Error('Failed to obtain access token');
    }

    setStatus('Getting long-lived access token...');
    
    // Exchange for a long-lived token
    const longLivedTokenResponse = await getLongLivedToken(tokenResponse.access_token);
    
    // Get the user's authentication token
    const userToken = await getToken();
    
    setStatus('Saving authentication data...');
    
    // Save the Instagram token to your backend - update URL
    const response = await fetch(`${API_BASE_URL}/api/instagram/save-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        instagramUserId: tokenResponse.user_id,
        accessToken: longLivedTokenResponse.access_token,
        expiresIn: longLivedTokenResponse.expires_in,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save Instagram token');
    }

    setStatus('Instagram authentication successful!');
    
    // Store the token in localStorage for immediate use
    localStorage.setItem('instagram_access_token', longLivedTokenResponse.access_token);
    localStorage.setItem('instagram_user_id', tokenResponse.user_id);
    
    // Notify any listeners that authentication was successful
    window.postMessage({ 
      type: 'INSTAGRAM_AUTH_SUCCESS',
      token: longLivedTokenResponse.access_token,
      userId: tokenResponse.user_id
    }, window.location.origin);
    
    // Navigate back to the integrations page
    setTimeout(() => {
      navigate('/integrations');
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-4">Instagram Authentication</h2>
        
        {error ? (
          <div className="bg-red-900 text-white p-4 rounded mb-4">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        ) : (
          <div className="bg-gray-700 p-4 rounded mb-4">
            <p className="text-white">{status}</p>
            <div className="mt-4 w-full bg-gray-600 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full w-full animate-pulse"></div>
            </div>
          </div>
        )}
        
        {error && (
          <button 
            onClick={() => navigate('/integrations')} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mt-4"
          >
            Return to Integrations
          </button>
        )}
      </div>
    </div>
  );
};

export default InstagramCallback; 