var User = require('../models/user');
var Session = require('../models/session');

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

generateSession = function(user) {
	let token = generateToken();
	let ttl = new Date().getTime()+ttl_diff;

	let session = new Session({
		"userId":user._id,
		"ttl":ttl,
		"token":token,
		"accessLevel":user.accessLevel,
	});
	
	return session;
}

exports.logout = (req, res, next) => {
	let token = req.headers.token;

	if (token) {
		Session.findOne({"token":token}, function(err, session) {
			if (err) {
				console.log("Find session failed. Still logging out");
			}
			if (session) {
				session.remove();
			}
		});
	}

	return res.status(200).json({"message":"session closed"});
}

exports.login = (req, res, next) => {
	if (!req.body || !req.body.email || !req.body.password) {
		return res.status(422).json({"error":"wrong credentials"});
	}

	User.findOne({"email":req.body.email}, function(err, user) {

		if (err || !user) {
			return res.status(422).json({"error":"wrong credentials"});
		}

		if (user.validatePassword(req.body.password)) {
			if (user.accessLevel == 0) {
				return res.status(403).json({"error":"useraccount disabled"});
			}

			let session = generateSession(user);

			session.save(function(err, session) {
				if (err) {
					return res.status(422).json({"error":"wrong credentials"});
				}
				return res.status(200).json({
					"token":session.token,
					"user": {
						"accessLevel":user.accessLevel,
						"email":user.email,
						"firstName":user.firstName,
						"lastName":user.lastName,
						"_id":user._id
					}
				});
			});
		} else {
			return res.status(422).json({"error":"wrong credentials"});
		}
	});
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

		// Don't let anyone increase anyones AccessLevel above their own
		if (req.method == "PUT" && req.body.accessLevel > session.accessLevel) {
			req.body.accessLevel = session.accessLevel;
		}

		// Allow if accessing own data, for view and update
		if ((req.method == "PUT" || req.method == "GET") && req.params.id === session.userId) {
			return next();
		}

		// Allow all access if admin or super
		if (session.accessLevel >= 3) {
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

		if (session.accessLevel >= 3) {
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