var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    googleId: {
        type: String
    },
    access_token: {
        type: String
    }
}, {
    versionKey: false,
    collection: 'GoogleUsers'
});

var googleUser = module.exports = mongoose.model('GoogleUsers', UserSchema);

module.exports.getUsersAPI = function (data, callback) {
	var filter = (data) ? data.body : {};
	googleUser.find(filter, function (error, users) {
		if(error) return callback(error, null);
		else return callback(null, users);
	});
}