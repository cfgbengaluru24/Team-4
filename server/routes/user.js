const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import your User model
const UnverifiedUser = require('../models/UnverifiedUser'); // Import your UnverifiedUser model
const { verifyToken } =require ('../controllers/authController');

// get a list of unverified users
router.get('/unverified',verifyToken, async ( req, res ) =>{
    if(req.user.user.userType != 'admin'){
        res.status(401).json({message : 'Unauthorized Access : Only admins can access'});
        return;
    }
    try{
        const users = await UnverifiedUser.find();
        res.status(200).json(users);
    }catch(err){
        console.error('Error fetching users:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// verify a user using his userid
router.get('/verify/:userid',verifyToken, async ( req, res ) =>{
    if(req.user.user.userType != 'admin'){
        res.status(401).json({Error : 'Unauthorized Access : Only admins can access'});
        return ;
    }
    const userid = req.params.userid;
    try{
        const user = await UnverifiedUser.findOne({ _id: userid }).select('-_id');;
        const result = await UnverifiedUser.deleteOne({ _id: userid });
        
        const newUser = new User(user.toObject());
        await newUser.save();

        res.status(200).json({message : "User verified successfully"});
    }catch(err){
        console.error('Error fetching users:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// route to decline a user's request for verification
router.get('/decline/:userid',verifyToken, async ( req, res ) =>{
    if(req.user.user.userType != 'admin'){
        res.status(401).json({Error : 'Unauthorized Access : Only admins can access'});
        return ;
    }
    const userid = req.params.userid;
    try{
        await UnverifiedUser.deleteOne({ _id: userid });

        res.status(200).json({message : "Admin request declined !!"});
    }catch(err){
        console.error('Error fetching users:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// route to return a list of admins
router.get('/admins',verifyToken, async ( req, res ) => {
    try{
        const admins= await User.find({userType : "admin"});
        res.status(200).json(admins);
    }catch(err){
        console.log(err);
        res.status(500).json({message : "Server Error"});
    }
})


router.put('/profilepicture', verifyToken, async (req, res) => {
    const userid = req.user.user.id;
    const profilepicture =req.body.profilepicture;
    try {
        const filter = { _id: userid }; // Assuming the document has an _id field
        const updateDoc = {
            $set: {
                profilepicture: profilepicture
            }
        };

        await User.updateOne(filter, updateDoc);
        res.status(200).json({message :"Profile Picture Updated !!"});
    } catch (error) {
        console.error('Error fetching user:', error.message);
        res.status(500).json({ Error: 'Server error' });
    }
});

router.get('/:userid', verifyToken, async (req, res) => {
    const userid = req.params.userid; // Corrected to access userid from params
    try {
        // Find user by userid (assuming userid is _id of the user)
        const user = await User.findOne({ _id: userid }).select('-password'); // Exclude password field
        
        if (!user) {
            return res.status(404).json({ Error: 'User not found' });
        }
        
        // Return user details excluding password
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error.message);
        res.status(500).json({ Error: 'Server error' });
    }
});



module.exports = router;
