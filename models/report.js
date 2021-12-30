const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    rname:
    {
        type:String,
        required:true,
        trim:true
    },
    rcnic:
    {
        type:String,
        required:true,
        trim:true
    },
    remail:
    {
        type:String,
        required:true,
        trim:true
    },
    rep:
    {
        type:String,
        required:true,
        trim:true
    },
});

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;