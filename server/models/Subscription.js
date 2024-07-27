const mongoose = require ('mongoose');
const Subscription = new mongoose.Schema ({
  userId: String,
  username: String,
  userType: String,
  endpoint: String,
  keys: {
    p256dh: String,
    auth: String,
  },
});
module.exports = mongoose.model ('subscription', Subscription);