const Session = require("../models/session");

let ttl_diff = 1000*60*60;

generateToken = function() {
  let token = ""
  let letters = '^_!#$%&*+-0123456789<=>?@ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz'
  for(let i=0;i<1024;i++) {
    let temp = Math.floor(Math.random()*75);
    token = token + letters[temp]
  }
  return token;
}

exports.generateSession = function(user) {
	let token = generateToken();
	let ttl = new Date().getTime()+ttl_diff;
	let session = new Session({
		"username":user.username,
		"ttl":ttl,
		"token":token,
		"isAdmin":user.isAdmin,
	})
	return session
}

exports.isUserAdmin = (req, res, next) => {
	let token = req.headers.token;

	if (!token) {
		return res.status(403).json({"message":"forbidden"});
	}

	Session.findOne({"token":token}, function(err, session) {
		if (err || !session || !session.isAdmin) {
			return res.status(403).json({"message":"forbidden"});
		}
		
		return next();
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