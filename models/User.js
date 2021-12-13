const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fname:
    {
        type:String,
        required:true,
        trim:true
    },
    uname:
    {
        type:String,
        required:true,
        trim:true
    },
    email:
    {
        type:String,
        required:true,
        trim:true
    },
    DOB:
    {
        type:Date,
        required:true,
    },
    CNIC:
    {
        type:Number,
        required:true,
        unique:true
    },
    num:
    {
        type:Number,
        required:true,
        unique:true
    },
    password:
    {
        type:String,
        required:true,
        trim:true
    },
    cPassword:
    {
        type:String,
       
    },
    messages :[{
       type:String,
    }]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;