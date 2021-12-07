const jwt =require("jsonwebtoken");
const reg=require("../src/models/register");

const auth=async(req,res,next)=>{
try {
    const token=req.cookies.jwt;
    const verify=jwt.verify(token,process.env.SECRET_KEY);
    console.log("Ayaaa");
    console.log(token);
    console.log(process.env.SECRET_KEY);
    console.log("commmm");
    console.log(verify);

    const user =await reg.findOne({_id:verify._id})
    console.log(verify);

    
    req.token=token;
    req.user=user;

    next();
} catch (error) {
    res.status(401).send(error);
}
}
module.exports=auth;