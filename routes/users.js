const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
var challanss = require('../models/challan');
const User = require('../models/User');
const Reportt=require('../models/report');
const { ensureAuthenticated,forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page

router.get('/allchallans',ensureAuthenticated, function(req, res, next) {
      
  challanss.find((err, docs) => {
      if (!err) {
          res.render("allchallans", {
              data: docs
          });
      } else {
          console.log('Failed to retrieve the Course List: ' + err);
      }
  });

});
router.get('/allreports', ensureAuthenticated,function(req, res, next) {
      
  Reportt.find((err, docs) => {
      if (!err) {
          res.render("allreports", {
              data: docs
          });
      } else {
          console.log('Failed to retrieve the Course List: ' + err);
      }
  });

});
// Report Page
router.get('/report', forwardAuthenticated, (req, res) => res.render('report'));
router.post('/report', forwardAuthenticated, (req, res) => {
  const { rname,rcnic, remail,rep}=req.body;
  const newreport = new Reportt({
    rname,rcnic, remail,rep
  });
newreport.save();
  res.render('report')
});

router.get('/allchallans',ensureAuthenticated, (req, res) => res.render('allchallans'));


// About Page
router.get('/about', forwardAuthenticated, (req, res) => res.render('about'));

// Dashboard of admin

// Register
router.post('/register', (req, res) => {
  const { fname,uname, email,DOB,CNIC,num, password, cPassword } = req.body;
  let errors = [];

  if (!fname || !uname || !DOB || !CNIC || !num || !email || !password || !cPassword) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != cPassword) {
    errors.push({ msg: 'Passwords do not match' });
  }

 // if (password.length < 6) {
   // errors.push({ msg: 'Password must be at least 6 characters' });
  //}

  if (errors.length > 0) {
    res.render('register', {
      errors,
      fname,uname, email,DOB,CNIC,num, password, cPassword
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
       res.render('register', 
      {
          errors,
          fname,uname, email,DOB,CNIC,num, password, cPassword
        });
      } else {
        const newUser = new User({
          fname,uname, email,DOB,CNIC,num, password,isAdmin:"user"
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in!'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});
/*router.get('/secret', adminAuth(ROLE.ADMIN),(req, res) =>
  res.redirect('secret',
  console.log('ayyaaaaa'), {
  }) 
);*/
// Login
router.get('/secret',ensureAuthenticated, (req, res) =>{
  res.render('secret')})
router.get('/register',ensureAuthenticated,(req,res)=>res.render('register'))
router.post('/login', async(req, res, next) => {
 
   const password=req.body.password;
   const Emaill=req.body.email;
   
 const isMatchemail = await User.findOne({email:Emaill});
 if((bcrypt.compare(password , isMatchemail.password)) && (isMatchemail.isAdmin == "admin")){

   const result = await User.find();
   passport.authenticate('local', {
    successRedirect: '/users/secret',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
    // router.get('/secret', (req, res) =>{
     //res.render('secret')})
     //router.get('/register',(req,res)=>res.render('register'))
     //res.redirect('secret');

}else if((bcrypt.compare(password , isMatchemail.password)) && (isMatchemail.isAdmin == "user")){
  
   passport.authenticate('local', {
     successRedirect: '/dashboard',
     failureRedirect: '/users/login',
     failureFlash: true
   })(req, res, next);
 }





/*if(Emaill=='admin@1.com' && password=='admin')
{
  router.get('/secret', (req, res) =>{
    res.render('secret')})
    router.get('/register',(req,res)=>res.render('register'))
    res.redirect('secret');
}
else
{
  //console.log(ROLE.ADMIN);
  //console.log(ROLE.BASIC);

  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
}
*/


});
// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
