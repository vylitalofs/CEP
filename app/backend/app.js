var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/api');
var usersRouter = require('./routes/login');

var app = express();


// MongoDB with Mongoose
var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost/cep';
mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
