var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    id: {
        type: String
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    access_token: {
        type: String
    },
    refresh_token: {
        type: String
    }
}, {
    versionKey: false,
    collection: 'GoogleUsers'
});

var googleUser = module.exports = mongoose.model('GoogleUsers', UserSchema);

module.exports.findOrCreate = function(profile, atoken, rtoken, cb) {
    googleUser.find({ id: profile.id }, function(err, results) {
        if(results.length == 0) {
            var newUser = new googleUser({
                id: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                access_token: atoken,
                refresh_token: rtoken
            });
            newUser.save(cb);
        } else {
            cb(err, results[0]);
        }
    });
};

module.exports.findById = function(id, cb) {
    googleUser.findOneById({ _id: id }, cb);
};

module.exports.deleteUser = function(email, callback){
    googleUser.remove({email: email}, callback);
};