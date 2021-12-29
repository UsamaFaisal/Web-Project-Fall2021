const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const path=require("path");
const nodemailer=require('nodemailer');
const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
require("./db/conn");
//public
app.use(express.static(__dirname + '/public'));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.post('/send',(req,res)=>{

  console.log(req, res);
  const output=`
  <h3>CHALLAN DETAILS</h3>
  <ul>
  <li>Signed by:${req.body.wname}</li>
  <li>Name:${req.body.name}</li>
  <li>Father's Name:${req.body.faname}</li>
  <li>CNIC:${req.body.cnic}</li>
  <li>Caste:${req.body.caste}</li>
  <li>Vehicle Number:${req.body.vnumber}</li>
  <li>Violation:${req.body.Violation}</li>
  <li>Fine:${req.body.fine}</li>
  <li>TIME AND DATE:${req.body.dandt}</li>
  </ul>
  `;
  let transporter = nodemailer.createTransport({
   host:"smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'usamashk530@gmail.com', // generated ethereal user
      pass: 'alittlebaby', // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });
 
  let mailoptions={
    from: '"GOVT E-Challan" <usamashk530@gmail.com>', // sender address
    to: req.body.email.toString(), // list of receivers
    subject: "E_CHALLAN", // Subject line
    text: "Hello world?", // plain text body
    html:output, // html body
  };
  // send mail with defined transport object
  transporter.sendMail(mailoptions,(error,info)=>{
    if(error){
      return console.log(error);
    }
     
    console.log('Message sent : %s',info.messageId);
    console.log('Message sent : %s',nodemailer.getTestMessageUrl(info));
  });
  //{msg:'Challan Generated Successfully.'}
//res.render('welcome',);
passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/users/login',
  failureFlash: true
})(req, res);
})


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on  ${PORT}`));
