var express = require('express');
var router = express.Router();

var user = require('../database/user');
var google = require('../database/googleUser');

// Request Handlers
router.get('/', function (req, res, next) {
    user.getUsersAPI(null, function (err, user_result) {
        google.getUsersAPI(null, function (gerr, google_res) {
            if(err || gerr) {
                var error = {"loginapp_err": err.message, "google_err": gerr.message};
                res.json({"error": error});
            } else {
                result = {};
                if(user_result.length > 0) result.loginapp_data = user_result;
                if(google_res.length > 0) result.google_data = google_res;
                res.json({"result": result});
            }
        });
    });
});

router.post('/getData', function (req, res, next) {
    var data = req.body;
    debug("Recieved DATA: " + data);
    var err, result = null;
    if(!data) err = 'invalid input';
	else result = parseInt(data.id) + 1;
    res.json({"error": err, "result": result});
});

router.post('/getUsers', function (req, res, next) {
    user.getUsersAPI(req.body, function (err, user_result) {
        if(user_result.length == 0) {
            google.getUsersAPI(req.body, function (gerr, google_res) {
                var error = result = null;
                if(err || gerr) {
                    if(err && gerr) error = err.message.concat(gerr.message);
                    else error = (err || gerr);
                    res.json({"error": error});
                } else {
                    res.json({"result": google_res});
                }
            });
        } else res.json({"result": user_result});
    });
});

module.exports = router;