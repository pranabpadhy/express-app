var express = require('express');
var router = express.Router();

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	res.render('index', { user: req.user });
});

// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

router.get('/logout', function(req, res){
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/login');
});

function ensureAuthenticated(req, res, next){
	console.log("authentication:", req.isAuthenticated());
	if(req.isAuthenticated()) return next();
	else res.redirect('/login');
}

module.exports = router;