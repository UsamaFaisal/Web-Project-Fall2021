//hbs iske andar package jason main handle bars hain engine
const express=require("express");
const path=require("path");
const bcrypt=require("bcryptjs");
var cookieParser = require('cookie-parser');
const jwt=require("jsonwebtoken");
var bodyParser=require('body-parser');
var jsonParser=bodyParser.json()
const hbs=require("hbs");
const auth=require("../src/auth");
//SECRET_KEY='MYNAMEISFAIZAIAMAWEBSTUDENTPLEASEDONTTAKEWEBATYOURREGISTRATION'
const app = express();
require("../src/db/conn");
const port = process.env.port || 3000;
const static_path=path.join(__dirname,"../public")
const templates_path=path.join(__dirname,"../templates/views")
const partials_path=path.join(__dirname,"../templates/partials")
//aab maine static app bna liya public folder jiske anadr html file pri hui hai
//isko access krna aab kaise karein
app.use(express.static(static_path))
app.set("view engine","hbs");
app.set("views",templates_path)
hbs.registerPartials(partials_path)
const Login=require("../src/models/register");
const session = require("express-session");
app.use(express.json());
app.use(express.urlencoded({extended:false}));

/*app.use(session({
    secret:'keyboard faiza',
    resave:false,
    saveUninitialized:true,
    cookie:{
        secure:false, maxAge:60000
    } 
}))*/

app.get("/",(req,res) => 
{
    // res.send("hello form")
    res.render("index")
})
app.get("/secret",async(req,res)=>{

    res.render("secret",{
      Loginname: uname ,
    });
})
app.get("/admin",async(req,res)=>{

  res.render("admin");
})
app.get("/register",(req,res) => 
{
  //  req.session? req.session++ : req.session=1;
    // res.send("hello form")
    res.render("register")
})
app.get("/login",(req,res) => 
{
  //  req.session? req.session++ : req.session=1;
    // res.send("hello form")
    res.render("login")
})
 



//create a new user in our database
app.post("/register",async (req,res) => 
{
    // res.send("hello form")
//res.render("register")
try{
//  console.log(req.body.fname);
 const Password=req.body.Password;
  const cPassword=req.body.cPassword;
  if(Password === cPassword)
 {
     const loginPerson=new Login({
         fname:req.body.fname,
         uname:req.body.uname,
         Email:req.body.Email,
         DOB:req.body.DOB,
         CNIC:req.body.CNIC,
         num:req.body.num,
         Password:req.body.Password,
         cPassword:req.body.cPassword,

     })
     
  //  return res.send("the success part" + loginPerson);
      
  const token=await loginPerson.generateAuthToken();
  //   return res.send("the token part" + token);

 
     const registered = await loginPerson.save();
  //   res.cookie("jwt",token,{
  //     expires:new Date(Date.now()+30000),
   //    httpOnly:true
   //  })
    // const token = jwt.sign({ _id: loginPerson._id }, process.env.SECRET_KEY);
    ///  res.send(token);
   // return res.send("the page part" + registered);
  //   res.status(201);
    res.render("index");
    /* app.get("/",(req,res) => 
     {
         // res.send("hello form")
         res.render("index")
     })*/
  }
 else
  {
    res.send("password is incorrect");
}
}catch(e)
{
  res.status(400).send(e);
//  return res.send("the error part page");
}
})


app.post("/login",async (req,res) => 
{
  try{
    const Email=req.body.Email;
    const Password=req.body.Password;
  if(Email==="admin@1.com" && Password==="admin")
   {
    res.status(201).redirect('/admin');
   }
   const useremail=await Login.findOne({Email:Email});
   if(!(useremail))
   {
    res.send("INVALID LOGIN DETAILS-");
   }
   console.log(useremail.Password);

   console.log(Password);

   const com=await bcrypt.compare(Password,useremail.Password);
  
   const token=await useremail.generateAuthToken();
  
  console.log("Match = "  + com);
   if(com)
   {
    
    res.cookie("jwt",token,{
      expires:new Date(Date.now()+30000),
      httpOnly:true
    })
    uname = useremail.uname;
    console.log(uname);
    res.status(201).redirect('/secret');
   }
   else 
   {
     res.send("INVALID LOGIN DETAILS");
   } 
   }
   catch(e)
   {
     res.status(400).send(e);

   }
});

app.get("/secret",auth,async(req,res)=>{
  try {
    
    console.log(req.useremail);
    res.clearCookie("jwt");
    console.log("LOGOUT SUCCESSFULLY.");
    res.status(201).redirect('/login');
    await res.useremail.save();
  
  //  res.render("login");

  } catch (error) {
    res.status(500).send(error);
  }
})
app.listen(port,()=> {
    console.log(`connection is live at the port number. ${port}`);
})