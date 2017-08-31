var express           = require('express');
var path              = require('path');
var cookieParser      = require('cookie-parser');
var bodyParser        = require('body-parser');
var exphbs            = require('express-handlebars');
var expressValidator  = require('express-validator');
var flash             = require('connect-flash');
var session           = require('express-session');
var passport          = require('passport');
var LocalStrategy     = require('passport-local').Strategy;
var mongo             = require('mongodb');
var mongoose          = require('mongoose');
var logger            = require('morgan');
var debug             = require('debug')('loginapp:server');
var cors              = require('cors');

mongoose.Promise      = require('bluebird');
mongoose.connect('mongodb://localhost:27017/loginapp', {
  useMongoClient: true,
  keepAlive: true
});
var db = mongoose.connection;

var routes = require('./routes/router');
var users = require('./routes/users');
var google = require('./routes/googleUser');

// Init App
var app = express();

// Set secret key
process.env.SECRET_KEY = ('ushusadmin').toString('base64');

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// CORS Middleware
app.use(cors());

// Logger Middleware
app.use(logger(':date[iso] :method :url :status :res[content-length] -> :response-time ms'));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(cookieParser());
app.use(session({
  key: 'express.sid',
  secret: process.env.SECRET_KEY,
  saveUninitialized: true,
  resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.'),
    root = namespace.shift(),
    formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Using routes
app.use('/', routes);
app.use('/users', users);
app.use('/google', google);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  var err = new Error('Requested URL: "'+fullUrl+'" is not found!!!');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.err_status = (err.status || 500);
  res.locals.err_msg = err.message;
  res.locals.err = err;

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;