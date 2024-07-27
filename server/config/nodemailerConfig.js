const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // e.g., 'Gmail', 'Yahoo', etc.
  auth: {
    user: process.env.EMAIL, // Your email address
    pass: process.env.PASSWORD // Your email password or app-specific password
  }
}); 

module.exports = transporter;
