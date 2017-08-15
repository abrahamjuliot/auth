const
  express = require('express'),
  router = express.Router(),
  User = require('../models/user'),
  mid = require('../middleware');

router
  .get('/profile', mid.requiresLogin, (req, res, next) => {
    User.findById(req.session.userId)
      .exec((error, user) => {
        if (error) {
          next(error);
        } else {
          res.render(
            'profile',
            { 
              title: 'Profile',
              name: user.name,
              favorite: user.favoriteBook
            }
          );
        }
      });
  })
  
  .get('/logout', (req, res, next) => {
    if (req.session) {
      // destroy session object
      req.session.destroy((err) => {
        if (err) {
          next(err);
        } else {
          res.redirect('/');
        }
      });
    }
  })
  .get('/login', mid.requiresLogout, (req, res) => {
    res.render('login', {title:'Log In'})
  })
  .post('/login', (req, res, next) => {
    const { email, password } = req.body
    if (email && password) {
      User.authenticate(email, password, (error, user) => {
        if (error || !user) {
          const err = new Error('Wrong email or password.');
          err.status = 401;
          next(err);
        } else {
          req.session.userId = user._id;
          res.redirect('/profile');
        }
      });
    } else {
      const err = new Error('Email and password are required.');
      err.status = 401;
      next(err);
    }
  })
  .get('/register', mid.requiresLogout, (req, res) => {
    res.render('register', {title:'Sign Up'})
  })
  .post('/register', (req, res, next) => {
    const
      { email, name, favoriteBook, password, confirmPassword } = req.body;

    if (email && name && favoriteBook && password && confirmPassword) {
      
      // if passwords do not match
      if (password !== confirmPassword) {
        const err = new Error('Passwords do not match.');
        err.status = 400;
        next(err);
      } else {
        const userData = {
          email: email,
          name: name,
          favoriteBook: favoriteBook,
          password: password,
          confirmPassword: confirmPassword,
        };
        
        // use schema's create method to insert doc into Mongo
        User.create(userData, (error, user) => {
          if (error) {
            next(error);
          } else {
            req.session.userId = user._id;
            res.redirect('/profile');
          }
        });
      }
    } else {
      const err = new Error('All fields required.');
      err.status = 400;
      next(err);
    }
  })
  .get('/', (req, res) => res.render('index', {title: 'Home'}))
  .get('/about', (req, res) => res.render('about', {title:'About'}))
  .get('/contact', (req, res) => res.render('contact', {title:'Contact'}))

module.exports = router;
