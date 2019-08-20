const Session = require("../models/session");

let ttl_diff = 1000*60*60;

generateToken = function() {
	let token = ""
	let letters = '^_!#$%&*+-0123456789<=>?@ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz'
	
	for (let i=0; i < 1024; i++) {
		let temp = Math.floor(Math.random()*75);
		token = token + letters[temp]
	}

	return token;
}

exports.generateSession = function(user) {
	let token = generateToken();
	let ttl = new Date().getTime()+ttl_diff;
	let session = new Session({
		"userId":user._id,
		"ttl":ttl,
		"token":token,
		"isAdmin":user.isAdmin,
	})
	return session
}

// Allow access if accessing own info, or user is admin
exports.isOwnDataOrAdmin = (req, res, next) => {
	let token = req.headers.token;

	if (!token) {
		return res.status(403).json({"message":"forbidden"});
	}

	Session.findOne({"token":token}, function(err, session) {
		if (err || !session) {
			return res.status(403).json({"message":"forbidden"});
		}

		if (session.isAdmin) {
			return next();
		}

		if (req.params.id === session.userId && req.method == "GET") {
			return next();
		}

		// In case of user info update on non-admin account
		// always make sure user does not attempt to change admin status
		if (req.params.id === session.userId && req.method == "PUT") {
			req.body.isAdmin = false

			return next();
		}

		return res.status(403).json({"message":"forbidden"});
	})
}

exports.isUserAdmin = (req, res, next) => {
	let token = req.headers.token;

	if (!token) {
		return res.status(403).json({"message":"forbidden"});
	}

	Session.findOne({"token":token}, function(err, session) {
		if (err || !session) {
			return res.status(403).json({"message":"forbidden"});
		}

		if (session.isAdmin) {
			return next();
		}

		return res.status(403).json({"message":"forbidden"});
	})
}


exports.isUserLogged = (req, res, next) => {
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