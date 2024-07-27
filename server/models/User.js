const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        required: true,
    },
    profilepicture:{
        type: String,
        default: "https://freesvg.org/img/abstract-user-flat-4.png",
    },
    camps:{
        type: Number,
        default: 0,
    },
    gender:{
        type:String
    }
},{
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
