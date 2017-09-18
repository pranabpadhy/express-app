var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../database/user');
var googleUser = require('../database/googleUser');

// Register User
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid. Can\'t update account details.').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match. Can\'t update account details.').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) {
				req.flash('error', err);
				res.redirect('/register');
			} else {
				req.flash('success_msg', 'You are registered and loggedin with new credentials.');
				req.body = {};
				req.body.username = username;
				req.body.password = password2;
				res.redirect(307, '/users/login/callback');
			}
		});
	}
});

// Update User
router.post('/update', function(req, res){
	var id = req.body.ID;
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('ID', 'Invalid id. Can\'t update account details.').notEmpty();
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid.  Can\'t update account details.').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match.  Can\'t update account details.').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('index',{
			errors:errors
		});
	} else {
		var newUser = new User({
			id: id,
			name: name,
			email:email,
			username: username,
			password: password
		});
		
		User.updateUser(newUser, function(err, result){
			if(err) {
				req.flash('error', err);
				res.redirect('/');
			} else {
				req.flash('success_msg', 'Your account is updated.');
				req.body = {};
				req.body.username = username;
				req.body.password = password2;
				res.redirect(307, '/users/login/callback');
			}
		});
	}
});

// Delete User
router.delete('/delete/:email', function(req, res){
	var email = req.params.email;

	User.deleteUser(email, function(err, result){
		if(err) req.flash('error', err);
		else req.flash('success_msg', 'Your account is deleted.');
		res.json({'error': err, 'result':result.result});
	});
});

// For Session
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	if(user.access_token) googleUser.getUserById(user._id, done);
	else User.getUserById(user._id, done);
});

passport.use(new LocalStrategy({
	callbackURL: 'http://localhost:8080/users/login/callback'
}, function(user, password, done) {
  	User.getUser(user, function(err, user){
   		if(err || !user) return done(err, false, {message: 'Unknown User'});
   		else {
			User.comparePassword(password, user.password, function(err, isMatch){
   	  			if(isMatch) return done(null, user);
   	  			else return done(err, false, {message: 'Invalid password'});
   			});
		}
  	});
}));

// Login User
router.post('/login/callback', passport.authenticate('local', {
	failureRedirect:'/login',
	failureFlash: true
}), function(req, res) {
	req.session.save(function () {
    	res.redirect('/');
  	});
});

module.exports = router;