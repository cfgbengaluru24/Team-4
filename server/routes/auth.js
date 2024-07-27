const express = require('express');
const router = express.Router();
const { register, login, sendOtp, verify, verifyToken } = require('../controllers/authController');
const jwt = require('jsonwebtoken');

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// otp route
router.post('/sendOtp', sendOtp);

// token verification route
router.get('/verify' , verifyToken , verify);

// Middleware function to verify token

module.exports = router;
