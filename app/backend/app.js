var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var apiRouter = require('./routes/api');
var loginRouter = require('./routes/login');
const Session = require("./models/session");

var app = express();


// MongoDB with Mongoose
var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost/cep';
mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


let ttl_diff = 1000*60*60;

isUserLogged = (req,res,next) => {
	let token = req.headers.token;

	if (!token) {
		return res.status(403).json({"message":"forbidden"});
	}
	
	Session.findOne({"token":token}, function(err, session) {

		if (err || !session) {
			return res.status(403).json({"message":"forbidden"});
		}

		let now = new Date().getTime();

		if (now > session.ttl) {
			Session.deleteOne({"_id":session._id}, function(err) {
				return res.status(403).json({"message":"forbidden"});
			});
		} else {
			req.session = {};
			req.session.email = session.email;
			session.ttl = now + ttl_diff;
			session.save(function(err, session) {
				return next();
			})
		}
	});
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api", isUserLogged, apiRouter);
app.use('/', loginRouter);

module.exports = app;
