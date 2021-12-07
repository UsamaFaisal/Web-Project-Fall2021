const express=require("express");
const mongoose= require("mongoose");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

const mschema = new mongoose.Schema({
    fname:
    {
        type:String,
        required:true
    },
    uname:
    {
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    Email:
    {
        type:String,
        required:true,
        trim:true,
        unique:true
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
    Password:
    {
        type:String,
        required:true,
        trim:true
    },
    cPassword:
    {
        type:String,
        required:true,
        trim:true
    },
  tokens:[{
        token:{
            type:String,
            required:true,
        }
    }]
})
mschema.methods.generateAuthToken = async function()
{
    try
    {
      //  console.log(this._id);
    const token= jwt.sign({_id:this._id},"mynameisfaizaamaniamastudentofwebbadluckbadluckbadluck");
        console.log(token);
      this.tokens=this.tokens.concat({token:token});
    await this.save();
    console.log("TOKEN SAVED SUCCESSFULLY.");
    return token;
    }
    catch(e)
    {
    res.send("the error part" + error);
    console.log("the error part" + error);
    }

}




mschema.pre("save",async function(next)
{
    if(this.isModified("Password"))
    {
 console.log(`The current password is ${this.Password}`);
        this.Password=await bcrypt.hash(this.Password,10);
      this.cPassword=await bcrypt.hash(this.cPassword,10);
  console.log(`The current password is ${this.Password}`);
   // this.cPassword=undefined;
    }
    next();
});

const Login=new mongoose.model("Login",mschema)
module.exports=Login;
