const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Add anime to collection
router.post('/add', auth, async (req, res) => {
    try {
        const { animeId, title, image_url } = req.body;
        
        if (!animeId || !title || !image_url) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if anime already exists in collection
        const user = await User.findById(req.user._id);
        const exists = user.collection.some(item => item.animeId === parseInt(animeId));
        
        if (exists) {
            return res.status(400).json({ message: 'Anime already in collection' });
        }

        // Add to collection
        user.collection.push({ 
            animeId: parseInt(animeId), 
            title, 
            image_url 
        });
        await user.save();

        res.json({ message: 'Added to collection', collection: user.collection });
    } catch (error) {
        console.error('Add to collection error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove anime from collection
router.delete('/remove/:animeId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.collection = user.collection.filter(item => item.animeId !== parseInt(req.params.animeId));
        await user.save();
        
        res.json({ message: 'Removed from collection', collection: user.collection });
    } catch (error) {
        console.error('Remove from collection error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's collection
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user.collection);
    } catch (error) {
        console.error('Get collection error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
