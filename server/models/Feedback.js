const mongoose = require('mongoose');
const { type } = require('os');

const FeedbackSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    centerName:{
        type: String,
        required: true
    },
    score:{
        type: Number,
        default:0
    },
    createdAt: {
        type: Date, 
        default: Date.now 
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
