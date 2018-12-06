const passport = require('passport');
const express = require('express');
const app = express();


module.exports = (app) => {
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }))

  // app.get('/auth/google/callback', passport.authenticate('google'),
  //   (req, res) => {
  //     // Successful authentication, redirect home.
  //     res.redirect('/home');
  //   });

  // app.get('/auth/google/callback', passport.authenticate('google'),
  //   (req, res) => {
  //     // Successful authentication, redirect home.
  //     res.redirect('https://t2m.io/CZHzwYuY');
  //   });

  app.get('/auth/google/callback', passport.authenticate('google'),
    (req, res) => {
      // Successful authentication, redirect home.
      res.redirect('https://t2m.io/CZHzwYuY');
    });

  app.get('/api/logout', (req, res) => {
    req.logout();
    req.session = null;
    res.redirect('https://t2m.io/8B51OWRq');
  })

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  })

};