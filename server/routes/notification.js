const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription'); 
const webpush = require ('web-push');

const publicVapidKey = process.env.VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

webpush.setVapidDetails('mailto:karanmatiyali123@gmail.com', publicVapidKey, privateVapidKey);

router.post('/subscribe',  async (req, res) => {
    const { subscription, user } = req.body;
    const {username, userType, _id : userId} = user;
    try{
        await Subscription.findOneAndUpdate(
            { userId },
            { ...subscription, userId, userType,username },
            { upsert: true }
        );
        // Send 201 - resource created
        res.status(201).json({message : "subscribed successfully"});
    }catch(err){
        res.status(401).json({message : "Server Error"})
    }
});

router.post('/send/all', async (req, res) => {
    const { payload } = req.body;
    try{
    
        // Get all subscriptions from the database
        const subscriptions = await Subscription.find();
    
        // Send notification to each subscription
        subscriptions.forEach(subscription => {
            webpush.sendNotification(subscription, JSON.stringify(payload)).catch(err => console.error(err));
        });
    
        res.status(200).json({ message: 'Notifications sent' });
    }catch(err){
        console.log(err);
        res.status(401).json({ message: 'Server Error' });
    }
});

router.post('/send/some', async (req, res) => {
    const { userIds, payload } = req.body;
    try{
    
        // Get all subscriptions from the database
        const subscriptions = await Subscription.find({ usesrId : { $in : userIds }});
    
        // Send notification to each subscription
        subscriptions.forEach(subscription => {
            webpush.sendNotification(subscription, JSON.stringify(payload)).catch(err => console.error(err));
        });
    
        res.status(200).json({ message: 'Notifications sent' });
    }catch(err){
        console.log(err);
        res.status(401).json({ message: 'Server Error' });
    }
});

module.exports = router;
