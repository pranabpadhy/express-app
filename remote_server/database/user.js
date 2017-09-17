var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: String,
    username: { type: String, index: true},
    email: { type: String, index: true},
    password: String,
}, {
    versionKey: false,
    collection: 'Users'
});

var user = module.exports = mongoose.model("Users", userSchema);

module.exports.getUsersAPI = function (data, callback) {
	user.find({}, function (error, users) {
		if(error) return callback(error, null);
		else return callback(null, users);
	});
}