const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Report Page
router.get('/report', forwardAuthenticated, (req, res) => res.render('report'));



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

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      fname,uname, email,DOB,CNIC,num, password, cPassword
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          fname,uname, email,DOB,CNIC,num, password, cPassword
        });
      } else {
        const newUser = new User({
          fname,uname, email,DOB,CNIC,num, password
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

// Login
router.post('/login', (req, res, next) => {
 
   const password=req.body.password;
  const Emaill=req.body.email;
 
  if(password == "admin" && Emaill=="admin@1.com" )
  {
    console.log('ayaaa');
    router.get('/secret', forwardAuthenticated, (req, res) =>
    res.render('secret')
  );
    res.redirect("secret");
 
}
else
{
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
}
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
