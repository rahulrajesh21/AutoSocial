import axios from 'axios';

const instagramClient = axios.create();

const getAllInstagramPosts = async (req, res) => {
    const instagramToken = process.env.INSTAGRAM_TOKEN;
    try {
        const response = await instagramClient.get(
            `https://graph.instagram.com/me/media?fields=id,caption,media_type,permalink&access_token=${instagramToken}`
        );
        res.json(response.data); // Return as a route response
    } catch (error) {
        console.error('Error fetching Instagram posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
};

export { getAllInstagramPosts }; 