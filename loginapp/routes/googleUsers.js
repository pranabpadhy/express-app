var express = require('express');
var router = express.Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var fs = require('fs');

var User = require('../database/googleUser');
var clientInfo = JSON.parse(fs.readFileSync('./utils/googleClient.json').toString());

// For Session (Uncomment if users page i.e. local strategy of passport is removed.)
/*passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, done);
});*/

// User Passport Google Strategy
passport.use(new GoogleStrategy({
    authorizationURL: clientInfo.web.auth_uri,
    tokenURL: clientInfo.web.token_uri,
    clientID: clientInfo.web.client_id,
    clientSecret: clientInfo.web.client_secret,
    callbackURL: clientInfo.web.redirect_uris[0],
    offline: true,
    passReqToCallback: true
}, function(request, accessToken, refreshToken, profile, done) {
    User.findOrCreate(profile, accessToken, refreshToken, function (err, user) {
        done(err, user);
    });
}));

// Login to Google
router.get('/login', passport.authenticate('google', {scope: clientInfo.web.scope }));

router.get('/login/callback', passport.authenticate('google', {
	failureRedirect: '/login',
	failureFlash: true
}), function(req, res) {
    res.redirect('/');
});

module.exports = router;