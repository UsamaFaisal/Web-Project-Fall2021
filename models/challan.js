const mongoose = require('mongoose');

const challanSchema = new mongoose.Schema({
    wname:
    {
        type:String,
        required:true,
        trim:true
    },
    name:
    {
        type:String,
        required:true,
        trim:true
    },
    faname:
    {
        type:String,
        required:true,
        trim:true
    },
    cnic:
    {
        type:String,
        required:true,
    },
    caste:
    {
        type:String,
        trim:true
    },
    email:
    {
        type:String,
        required:true,
        trim:true
    },
    vnumber:
    {
        type:String,
        required:true,
        trim:true
    },
    Violation:
    {
        type:String,
        required:true,
        trim:true
    },
    fine:
    {
        type:Number,
        required:true,
    },
    dandt:
    {
        type:Date,
        required:true,
    },
});

const Challan = mongoose.model('Challan', challanSchema);

module.exports = Challan;