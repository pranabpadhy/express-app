var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	email: {
		type: String,
		index: true
	},
	password: String,
	name: String
}, {
	versionKey: false,
	collection: 'Users'
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	getUserByUsername(newUser.username, function (username_error, userName) {
		if(username_error) return callback(username_error);
	   	if(userName){
	   	  	return callback('username already exists');
	   	} else {
	   		getUserByEmail(newUser.email, function (email_error, userEmail) {
				if(email_error) return callback(email_error);
			   	if(userEmail){
			   	  	return callback('Email already exists');
			   	} else {
			   		bcrypt.genSalt(10, function(err, salt) {
					    bcrypt.hash(newUser.password, salt, function(err, hash) {
					        newUser.password = hash;
					        newUser.save(callback);
					    });
					});
			   	}
			});
	   	}
	});
}

module.exports.updateUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        User.update({email:newUser.email}, {
	        	$set: {
	        		name: newUser.name,
	        		username: newUser.username,
	        		email: newUser.email,
	        		password: newUser.password
	        	}
	        }, {upsert: true}, callback);
	    });
	});
}

module.exports.deleteUser = function(id, callback){
	User.remove({_id:id}, callback);
}

var getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

var getUserByEmail = function(email, callback){
	var query = {email: email};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) return callback(errr);
    	callback(null, isMatch);
	});
}

module.exports.getUserByUsername = getUserByUsername;
module.exports.getUserByEmail = getUserByEmail;