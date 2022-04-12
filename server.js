const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

// Session Middleware
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');

const indexRouter = require('./routes/index');
const budgetsRouter = require('./routes/budgets');
const entriesRouter = require('./routes/entries');

// Load env constants
require('dotenv').config();

// Create the Express app
const app = express();

// Connect to MongoDB with Mongoose
require('./config/database');

// Configure Passport
require('./config/passport');

// Set Up View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Mount Session Middleware
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Make req.user Available In ejs Views
app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});

// Mount Routes with Appropriate Base Paths
app.use('/budgets', budgetsRouter);
app.use('/', entriesRouter);
app.use('/', indexRouter);

// Send 404 Page, if Invalid Request
app.use(function(req, res) {
  res.status(404).send('Cant find that!');
});

module.exports = app;
