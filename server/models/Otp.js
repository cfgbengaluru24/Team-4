const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OtpSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // The OTP will expire in 5 minutes
  }
});

module.exports = Otp = mongoose.model('Otp', OtpSchema);
