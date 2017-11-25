const express         = require('express');
const router          = express.Router();
const passport        = require('passport');
const passportConfig  = require('../config/passport');
const User            = require('../models/user');
const flash           = require('express-flash');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index', {title: "Amiplate"});
});

/* SIGNUP ROUTE */
router.route('/signup')

  .get((req, res, next) => {
    res.render('accounts/signup', { });
  })

  .post((req, res, next) => {
    User.findOne({ email: req.body.email }, function(err, existingUser) {
      if (existingUser) {
        req.flash('errors',  'Account with that email address already exists.');
        return res.redirect('/signup');
      } else {
        var user = new User();
        user.name = req.body.username;
        user.email = req.body.email;
        user.password = req.body.password;
        user.save(function(err) {
          if (err) return next(err);
          req.logIn(user, function(err) {
            if (err) return next(err);
            res.redirect('/');
          });
        });
      }
    });
  });

  // RESUME FROM HERE


/* LOGIN ROUTE */
router.route('/login')

  .get((req, res, next) => {
    if (req.user) return res.redirect('/');
    res.render('accounts/login', { });
  })

  .post(passport.authenticate('local-login', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

/* PROFILE ROUTE */
router.get('/profile', passportConfig.isAuthenticated, (req, res, next) => {
  res.render('accounts/profile', {});
});

router.get('/image-upload', (req, res, next) => {
  res.render('file-upload/form.ejs', {});
});

module.exports = router;
