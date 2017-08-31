var express = require('express');
var router = express.Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var fs = require('fs');

var User = require('../database/googleUser');
var clientInfo = JSON.parse(fs.readFileSync('./utils/googleClient.json').toString());

// Login
router.get('/', function(req, res){
  res.redirect('/google/login');
});

// User Passport Google Strategy
passport.use(new GoogleStrategy({
    authorizationURL: clientInfo.web.auth_uri,
    tokenURL: clientInfo.web.token_uri,
    clientID: clientInfo.web.client_id,
    clientSecret: clientInfo.web.client_secret,
    callbackURL: clientInfo.web.redirect_uris[0],
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    User.findOrCreate(profile, accessToken, refreshToken, function (err, user) {
      done(err, user);
    });
  }
));

// For Session
passport.serializeUser(function(user, done) {
	console.log("User Data:", user);
  	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, done);
});

// Login to Google
router.get('/login', passport.authenticate('google', {scope: clientInfo.web.scope }));

router.get('/login/callback', passport.authenticate('google', {
	failureRedirect: '/login',
	failureFlash: true
}), function(req, res) {
  console.log(req.user, req.isAuthenticated());
  req.session.save(function () {
    res.render('index', {user: req.user});
  });
});

module.exports = router;