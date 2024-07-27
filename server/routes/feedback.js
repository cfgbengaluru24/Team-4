const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

router.post('/',  async (req, res) => {
    const { userName, centerName, answers } =req.body;
    console.log(req.body);
    try {
        const score=3;
        const feedback = new Feedback({
            username:userName,
            centerName:centerName,
            score:score
        })
        feedback.save();
        
        res.status(200).json(feedback);

    } catch (error) {
        console.error('Error fetching posts:', error.message);
        res.status(500).json({ message : 'Server error' });
    }
});

module.exports = router;
