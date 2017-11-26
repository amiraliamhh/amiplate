const express       = require('express');
const path          = require('path');
const favicon       = require('serve-favicon');
const logger        = require('morgan');
const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');
const session       = require('express-session');
const MongoStore    = require('connect-mongo')(session);
const passport      = require('passport');
const flash         = require('express-flash');
const mongoose      = require('mongoose');

var index       = require('./routes/index');
var users       = require('./routes/users');
var fileUpload  = require('./routes/file-upload');
var imageUpload = require('./routes/image-upload');

const config = require('./config/secret');
const sessionStore = new MongoStore({ url: config.database, autoReconnect: true });

var app = express();

mongoose.connect(config.database, function(err) {
  if (err) console.log(err);
  console.log("Connected to the database");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.secret,
  store: new MongoStore({ url: config.database, autoReconnect: true })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

app.use('/', users);
app.use('/file-upload', fileUpload);
app.use('/image-upload', imageUpload);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
