const express = require('express');
const router = express.Router();
const Query = require('../models/Query'); // Import your User model
const { verifyToken } =require ('../controllers/authController');

router.get('/', verifyToken,  async (req, res) => {
    const userId = req.user.user.id
    try {
        const queries = await Query.find({ userId : userId }).sort({ createdAt: -1 });
        res.status(200).json(queries);

    } catch (error) {
        console.error('Error fetching queries:', error.message);
        res.status(500).json({ message : 'Server error' });
    }
});
router.get('/all', verifyToken,  async (req, res) => {
    if(req.user.user.userType != 'admin'){
        res.status(401).json({Error : 'Unauthorized Access : Only admins can access'});
        return;
    }

    try {
        
        const posts = await Query.find({answer : null}).sort({ createdAt: -1 });
        res.status(200).json(posts);

    } catch (error) {
        console.error('Error fetching queries:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/', verifyToken, async (req, res) => {
    const query = new Query({
        username: req.body.username,
        userId: req.body.userId,
        profilepicture: req.body.profilepicture,
        question: req.body.question,
        image: req.body.image,
        answer: req.body.answer,
    });
    try {
        const newQuery = await query.save();
        res.status(201).json({message:"Successfully posted a query !!"});
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
router.put('/', verifyToken, async (req, res) => {
    if(req.user.user.userType != 'admin'){
        res.status(401).json({message : 'Unauthorized Access : Only admins can access'});
        return;
    }
    const { queryId, answer } = req.body;
    try {
        const filter = { _id: queryId }; // Assuming the document has an _id field
        const updateDoc = {
            $set: {
                answer: answer
            }
        };

        const updatedQuery = await Query.updateOne(filter, updateDoc);
        res.status(200).json({message : "Query resolved Successfully !!"});
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
