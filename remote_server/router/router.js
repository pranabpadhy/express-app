var express = require('express');
var router = express.Router();

var user = require('../database/user');
var google = require('../database/googleUser');

// Request Handlers
router.get('/', function (req, res, next) {
    user.getUsersAPI(req.body, function (err, user_result) {
        google.getUsersAPI(req.body, function (gerr, google_res) {
            var error = result = null;
            if(err || gerr) {
                if(err && gerr) error = err.message.concat(gerr.message);
                else error = (err || gerr);
                res.json({"error": error});
            } else {
                if(user_result.length > 0 && google_res.length > 0) result = user_result.concat(google_res);
                else {
                    if(user_result.length > 0) result = user_result;
                    if(google_res.length > 0) result = google_res;
                }
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
        google.getUsersAPI(req.body, function (gerr, google_res) {
            var error = result = null;
            if(err || gerr) {
                if(err && gerr) error = err.message.concat(gerr.message);
                else error = (err || gerr);
                res.json({"error": error});
            } else {
                if(user_result.length > 0 && google_res.length > 0) result = user_result.concat(google_res);
                else {
                    if(user_result.length > 0) result = user_result;
                    if(google_res.length > 0) result = google_res;
                }
                res.json({"result": result});
            }
        });
    });
});

module.exports = router;