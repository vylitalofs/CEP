var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var apiRouter = require('./routes/api');
const Session = require("./models/session");

var authController = require('./controllers/authController');

var app = express();

const config = require('./config.json')

// MongoDB with Mongoose
var mongoose = require('mongoose');
mongoose.connect(config.mongo).then(
	() => {console.log("Success in connecting Mongodb")},
	error => {console.log("Error in connecting Mongodb:"+error)}
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api", authController.isUserLogged, apiRouter);
app.use('/login', authController.login);
app.use('/logout', authController.logout);

module.exports = app;