var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var apiRouter = require('./routes/api');
var authRouter = require('./routes/auth');
const Session = require("./models/session");

var authController = require('./controllers/authController'); 

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

app.use("/api", authController.isUserLogged, apiRouter);
app.use('/', authRouter);

module.exports = app;
