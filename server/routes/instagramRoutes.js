const express = require('express');
const router = express.Router();
const { getAllInstagramPosts } = require('../controllers/instagramController');

// Route to get all Instagram posts
router.get('/posts', getAllInstagramPosts);

module.exports = router; 