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
				req.flash('success_msg', 'You are registered and can login with new credentials now.');
				res.redirect('/login');
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

		googleUser.deleteUser(email, function(del_err, del_result){
			User.updateUser(newUser, function(err, result){
				console.log("router log: ", err, result);
				if(err) {
					req.flash('error', err);
					res.redirect('/');
				} else {
					req.flash('success_msg', 'Your account is updated.');
					res.redirect('/');
				}
			});
		});
	}
});

// Delete User
router.delete('/delete/:id', function(req, res){
	var id = req.params.id;

	User.deleteUser(id, function(err, result){
		console.log(err, result.result);
		if(err) req.flash('error', err);
		else req.flash('success_msg', 'Your account is deleted.');
		res.json({'error':err, 'result':result.result});
	});
});

passport.use(new LocalStrategy({
	callbackURL: 'http://localhost:8080/users/login/callback'
}, function(usernameOrEmail, password, done) {
  	User.getUserByUsername(usernameOrEmail, function(err, userbyusername){
   		if(err || !userbyusername) {
	   	 	User.getUserByEmail(usernameOrEmail, function(err, userbyemail){
	   			if(err || !userbyemail) return done(err, false, {message: 'Unknown User'});
	   	  		else {
	   	  	  		User.comparePassword(password, userbyemail.password, function(err, isMatch){
			   			if(isMatch) return done(null, userbyemail);
			   			else return done(err, false, {message: 'Invalid password'});
			   		});
	   	  		}
	   	  	});
   		} else {
			User.comparePassword(password, userbyusername.password, function(err, isMatch){
   	  			if(isMatch) return done(null, userbyusername);
   	  			else return done(err, false, {message: 'Invalid password'});
   			});
		}
  	});
}));

// For Session
passport.serializeUser(function(user, done) {
  	done(null, user);
});

passport.deserializeUser(function(id, done) {
  	User.getUserById(id, function(err, user) {
    	done(err, user);
  	});
});

// Login User
router.post('/login/callback', passport.authenticate('local', {
	successRedirect:'/',
	failureRedirect:'/login',
	failureFlash: true
}), function(req, res) {
	res.redirect('/');
});

module.exports = router;