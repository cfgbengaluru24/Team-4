const mongoose = require('mongoose');

const QuerySchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    userId:{
        type:String,
        required:true,
    },
    profilepicture:{
        type:String
    },
    question:{
        type: String,
        required: true,
    },
    image:{
        type: String,
    },
    answer: {
        type: String,
    },
    createdAt: {
        type: Date, 
        default: Date.now 
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Query', QuerySchema);
