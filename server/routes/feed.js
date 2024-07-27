const express = require('express');
const router = express.Router();
const Post = require('../models/Post'); // Import your User model
const { verifyToken } =require ('../controllers/authController');

router.get('/', verifyToken,  async (req, res) => {
    try {
        
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);

    } catch (error) {
        console.error('Error fetching posts:', error.message);
        res.status(500).json({ message : 'Server error' });
    }
});

router.post('/', verifyToken, async (req, res) => {
    const post = new Post({
        username: req.body.username,
        userId: req.body.userId,
        content: req.body.content,
        image: req.body.image,
        userType: req.body.userType,
        profilepicture: req.body.profilepicture,
    });

    try {
        await post.save();
        res.status(201).json({message : "Post shared Successfully !!"});
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
