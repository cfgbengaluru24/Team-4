const User = require('../models/User');
const UnverifiedUser = require('../models/UnverifiedUser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const OTP = require('../models/Otp');
const otpGenerator = require('otp-generator');
const transporter = require('../config/nodemailerConfig');

exports.sendOtp = async (req, res) => {
    const { email, password } = req.body;

    try{
        let user = await User.findOne({ email });
        let unverUser = await UnverifiedUser.findOne({ email });
        if (user || unverUser) {
            return res.status(400).json({ message : 'User already exists' });
        }
        if(password.length<4){
            return res.status(400).json({ message : 'Password should be atleast of length 4' });
        }
        
        const otp = otpGenerator.generate(6, { 
            upperCaseAlphabets: false, 
            specialChars: false, 
            lowerCaseAlphabets: false 
        });
        const newOtp = new OTP({ email, otp });
        await newOtp.save();
 
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'OTP Code for JPMC',
            html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1MsBhLbjY25OLUNAoXeqc_VN3CrHeClEgQw&s" alt="Company Logo" style="width: 100px;">
            </div>
            <h2 style="color: #333; text-align: center;">Your OTP Code</h2>
            <p style="font-size: 16px; color: #555;">Hello,</p>
            <p style="font-size: 16px; color: #555;">We received a request to access your account. Use the following One-Time Password (OTP) to complete the process:</p>
            <div style="text-align: center; margin: 20px 0;">
                <span style="font-size: 30px; font-weight: bold; color: #4CAF50; letter-spacing: 10px;">${otp}</span>
            </div>
            <p style="font-size: 16px; color: #555;">If you did not request this code, please ignore this email or contact support if you have any questions.</p>
            <p style="font-size: 16px; color: #555;">Thank you,<br>JPMC Code for Good</p>
            <div style="border-top: 1px solid #ddd; margin-top: 20px; padding-top: 10px; text-align: center;">
                <p style="font-size: 14px; color: #999;">This is an automated message, please do not reply.</p>
                <p style="font-size: 14px; color: #999;">&copy; ${new Date().getFullYear()} JPMC Code For Good. All rights reserved.</p>
            </div>
        </div>`
        };
        
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'OTP sent to email.'});

    }catch(err){
        console.log(err);
        res.status(500).json({ message: 'Server error' });
    }
}

// Register user
exports.register = async (req, res) => {
    const { username, email, password, otp, userType } = req.body;
    try {
        const otpRecord = await OTP.findOne({ email, otp });
        if (!otpRecord) {
            return res.status(400).json({ message : 'Invalid OTP' });
        }
        // Optionally delete the OTP record after successful verification

        
        let savedUser;
        if(userType==="admin"){
            let unverifiedUser = new UnverifiedUser({
                username,
                email,
                password,
                userType
            });
            const salt = await bcrypt.genSalt(10);
            unverifiedUser.password = await bcrypt.hash(password, salt);
            savedUser = await unverifiedUser.save();
    
        }else{
            let user = new User({
                username,
                email,
                password,
                userType
            });
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            savedUser = await user.save();
        }

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Welcome to JPMC Code For Good!',
            html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://yourcompanylogo.com/logo.png" alt="NGO logo" style="width: 100px;">
            </div>
            <h2 style="color: #333; text-align: center;">Welcome to [Your Company Name]!</h2>
            <p style="font-size: 16px; color: #555;">Hello ${savedUser.username},</p>
            <p style="font-size: 16px; color: #555;">Thank you for registering with us. We are thrilled to have you on board!</p>
            <p style="font-size: 16px; color: #555;">Here are a few things you can do next:</p>
            <ul style="font-size: 16px; color: #555; list-style-type: disc; padding-left: 20px;">
                <li>Explore our services and offerings.</li>
                <li>Update your profile information.</li>
                <li>Connect with other members.</li>
            </ul>
            <p style="font-size: 16px; color: #555;">If you have any questions or need assistance, feel free to contact our support team.</p>
            <p style="font-size: 16px; color: #555;">Best Regards,<br>Your Company Name Team</p>
            <div style="border-top: 1px solid #ddd; margin-top: 20px; padding-top: 10px; text-align: center;">
                <p style="font-size: 14px; color: #999;">&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
            </div>
        </div>`
        };
        
        await transporter.sendMail(mailOptions);
        
        await OTP.deleteOne({ email, otp });

        res.status(200).send(savedUser);
    } catch (err) {
        console.log(err);
        res.status(500).json({message : 'Server error'});
    }
};

// Login user
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        let unverUser = await UnverifiedUser.findOne({ email });
        if (!user && !unverUser) {
            return res.status(400).json({ message : 'User Not found !!' });
        }else if(unverUser && !user){
            return res.status(400).json({ message : 'User Not verified !!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message : 'Invalid Password !!' });
        }

        const payload = {
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                password: user.password,
                userType: user.userType
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ token, id : user._id });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({message : 'Server error'});
    }
};

//verify token and return user if token is correct
exports.verify = async (req, res) => {
    // Access req.user to get user data
    const userId = req.user.user.id;
    try {
        // Find user by userid (assuming userid is _id of the user)
        const user = await User.findOne({ _id: userId }).select('-password'); // Exclude password field
        
        if (!user) {
            return res.status(404).json({ message : 'User not found' });
        }
        
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyToken= (req, res, next) => {
    const token = req.headers.authorization; // Get token from headers
    if (!token) {
        return res.status(401).json({ message: 'Auth token is not provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded; // Store decoded user data in request object
        next();
    });
}
