const mongoose = require('mongoose');
const router = require('express').Router();
const User = mongoose.model('User');
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

router.post("/logout", function(req, res) {
	let token = req.headers.token;
	if(token) {
		Session.findOne({"token":token}, function(err, session) {
			if(err) {
				console.log("Find session failed. Still logging out");
			}
			session.remove()
		});
	}
	return res.status(200).json({"message":"success"});
})

router.post("/login", function(req, res) {

	if(!req.body || !req.body.email || !req.body.password) {
		return res.status(422).json({"error":"wrong credentials"});		
	}

	if(req.body.email.length < 4 || req.body.password.length < 8) {
		return res.status(422).json({"error":"wrong credentials"});		
	}

	User.findOne({"email":req.body.email}, function(err, user) {

		if(err || !user) {
			return res.status(422).json({"message":"wrong credentials"});			
		}

		if (user.validatePassword(req.body.password)) {

			let token = generateToken();
			let ttl = new Date().getTime()+ttl_diff;
			let session = new Session({
				"username":user.username,
				"ttl":ttl,
				"token":token
			})

			session.save(function(err, session) {
				if(err) {
					return res.status(422).json({"error":"wrong credentials"});						
				} 
				return res.status(200).json({"token":token});
			});

		} else {
			return res.status(422).json({"error":"wrong credentials"});				
		}
		
	});
});

//GET current route (required, only authenticated users have access)
router.get('/current', (req, res, next) => {
  const { payload: { id } } = req;

  return User.findById(id)
    .then((user) => {
      if(!user) {
        return res.sendStatus(400);
      }

      return res.json({ user: user.toAuthJSON() });
    });
});

module.exports = router;