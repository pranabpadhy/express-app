/* <------- Remote Server -------> */
var express         = require('express');
var path            = require('path');
var bodyParser      = require('body-parser');
var cors            = require('cors');
var mongoose        = require('mongoose');
var logger          = require('morgan');
var debug           = require('debug')('remote_server:server');

var router         = require('./router/router');

var app             = express();

// Database Connection
mongoose.connect('mongodb://localhost:27017/loginapp', {
  useMongoClient: true,
  keepAlive: true
}); 

// Middlewares
app.use(logger(':date[iso] :method :url :status :res[content-length] -> :response-time ms'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Use router
app.use(router);

module.exports = app;
