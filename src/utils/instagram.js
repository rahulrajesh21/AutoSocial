// Instagram authentication utilities

// Instagram App credentials - replace with your own from Facebook Developer Portal
const INSTAGRAM_APP_ID = import.meta.env.VITE_INSTAGRAM_ACCESS;
const INSTAGRAM_APP_SECRET = import.meta.env.VITE_INSTAGRAM_SECRET;
// Use the updated ngrok URL
const INSTAGRAM_REDIRECT_URI = 'https://better-utterly-meerkat.ngrok-free.app/auth/instagram/callback';

/**
 * Initiates the Instagram OAuth flow
 */
export const initiateInstagramLogin = () => {
  // Full set of Instagram Business permissions
  const scopes = 'instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish,instagram_business_manage_insights';
  
  // Additional parameters for better user experience
  const params = new URLSearchParams({
    client_id: INSTAGRAM_APP_ID,
    redirect_uri: INSTAGRAM_REDIRECT_URI,
    scope: scopes,
    response_type: 'code',
    enable_fb_login: '0',
    force_authentication: '1'
  });
  
  const authUrl = `https://www.instagram.com/oauth/authorize?${params.toString()}`;
  
  console.log('Instagram auth URL:', authUrl); // For debugging
  
  // Open the Instagram authorization page in a new window
  window.open(authUrl, '_blank', 'width=800,height=600');
};

/**
 * Exchanges the authorization code for an access token
 * @param {string} code - The authorization code from Instagram
 * @returns {Promise<Object>} The access token response
 */
export const exchangeCodeForToken = async (code) => {
  try {
    const response = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: INSTAGRAM_APP_ID,
        client_secret: INSTAGRAM_APP_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: INSTAGRAM_REDIRECT_URI,
        code,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Instagram API error response:', errorText);
      throw new Error(`Failed to exchange code for token: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    throw error;
  }
};

/**
 * Gets the long-lived access token
 * @param {string} shortLivedToken - The short-lived access token
 * @returns {Promise<Object>} The long-lived token response
 */
export const getLongLivedToken = async (shortLivedToken) => {
  try {
    const response = await fetch(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${INSTAGRAM_APP_SECRET}&access_token=${shortLivedToken}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Instagram API error response:', errorText);
      throw new Error(`Failed to get long-lived token: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting long-lived token:', error);
    throw error;
  }
}; 