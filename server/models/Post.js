const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
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
    content:{
        type: String,
    },
    image:{
        type: String,
    },
    userType: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date, 
        default: Date.now 
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Post', PostSchema);
